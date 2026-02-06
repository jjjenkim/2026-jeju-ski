#!/usr/bin/env python3
"""
Antigravity Cache
Persistent cache with TTL and size management
"""

import json
import time
from pathlib import Path
from typing import Any, Optional, Dict


class AntigravityCache:
    """Persistent cache with TTL for 2026_Antigravity workspace"""
    
    def __init__(
        self, 
        cache_file: str = "data/cache/cache.json",
        project_root: str = "/Users/jenkim/Downloads/2026_Antigravity",
        ttl: int = 3600,
        max_size: int = 1000
    ):
        """
        Initialize cache
        
        Args:
            cache_file: Relative path to cache file
            project_root: Root directory of the workspace
            ttl: Time-to-live in seconds
            max_size: Maximum number of cache entries
        """
        self.root = Path(project_root)
        self.f = self.root / cache_file
        self.f.parent.mkdir(parents=True, exist_ok=True)
        self.ttl = ttl
        self.max = max_size
        self.c: Dict[str, Dict[str, Any]] = self._load()

    def _load(self) -> Dict[str, Dict[str, Any]]:
        """Load cache from disk"""
        if self.f.exists():
            try:
                data = json.loads(self.f.read_text(encoding='utf-8'))
                return data if isinstance(data, dict) else {}
            except (json.JSONDecodeError, UnicodeDecodeError) as e:
                print(f"Warning: Could not load cache: {e}")
                return {}
        return {}

    def _save(self) -> None:
        """Save cache to disk"""
        try:
            self.f.write_text(
                json.dumps(self.c, indent=2, ensure_ascii=False),
                encoding='utf-8'
            )
        except Exception as e:
            print(f"Warning: Could not save cache: {e}")

    def _clean(self) -> None:
        """Remove expired entries and enforce size limit"""
        now = time.time()
        
        # Remove expired entries
        self.c = {
            k: v for k, v in self.c.items() 
            if now - v.get('ts', 0) < self.ttl
        }
        
        # Enforce size limit
        if len(self.c) > self.max:
            items = sorted(self.c.items(), key=lambda x: x[1].get('ts', 0))
            keep = int(self.max * 0.8)
            self.c = dict(items[-keep:])

    def get(self, key: str) -> Optional[Any]:
        """
        Retrieve value from cache
        
        Args:
            key: Cache key
            
        Returns:
            Cached value or None if not found/expired
        """
        self._clean()
        v = self.c.get(key)
        return v['data'] if v else None

    def set(self, key: str, value: Any) -> None:
        """
        Store value in cache
        
        Args:
            key: Cache key
            value: Value to cache
        """
        self.c[key] = {'data': value, 'ts': time.time()}
        self._clean()
        self._save()

    def delete(self, key: str) -> bool:
        """
        Delete entry from cache
        
        Args:
            key: Cache key
            
        Returns:
            True if deleted, False if not found
        """
        if key in self.c:
            del self.c[key]
            self._save()
            return True
        return False

    def clear(self) -> None:
        """Clear all cache entries"""
        self.c = {}
        self._save()

    def stats(self) -> Dict[str, Any]:
        """
        Get cache statistics
        
        Returns:
            Dictionary with cache statistics
        """
        now = time.time()
        valid_entries = sum(
            1 for v in self.c.values() 
            if now - v.get('ts', 0) < self.ttl
        )
        
        return {
            'total_entries': len(self.c),
            'valid_entries': valid_entries,
            'expired_entries': len(self.c) - valid_entries,
            'max_size': self.max,
            'ttl_seconds': self.ttl,
            'usage_percent': (len(self.c) / self.max * 100) if self.max > 0 else 0,
            'file': str(self.f),
            'file_size_bytes': self.f.stat().st_size if self.f.exists() else 0
        }

    def keys(self) -> list:
        """Get all cache keys"""
        self._clean()
        return list(self.c.keys())

    def has(self, key: str) -> bool:
        """
        Check if key exists in cache
        
        Args:
            key: Cache key
            
        Returns:
            True if key exists and not expired
        """
        return self.get(key) is not None

    def __contains__(self, key: str) -> bool:
        """Support 'in' operator"""
        return self.has(key)

    def __len__(self) -> int:
        """Get number of cache entries"""
        self._clean()
        return len(self.c)

    def __repr__(self) -> str:
        """String representation"""
        stats = self.stats()
        return (
            f"AntigravityCache("
            f"entries={stats['valid_entries']}/{stats['max_size']}, "
            f"ttl={self.ttl}s, "
            f"file={self.f.name})"
        )


# Example usage
if __name__ == "__main__":
    # Create cache instance
    cache = AntigravityCache()
    
    # Store some data
    cache.set("user:1", {"name": "Alice", "age": 30})
    cache.set("user:2", {"name": "Bob", "age": 25})
    cache.set("api:response", {"status": "ok", "data": [1, 2, 3]})
    
    # Retrieve data
    print(f"User 1: {cache.get('user:1')}")
    print(f"User 2: {cache.get('user:2')}")
    
    # Check existence
    print(f"Has 'user:1': {cache.has('user:1')}")
    print(f"Has 'user:3': {cache.has('user:3')}")
    
    # Show stats
    print(f"\nCache stats:")
    for key, value in cache.stats().items():
        print(f"  {key}: {value}")
    
    # Clear cache
    print(f"\nClearing cache...")
    cache.clear()
    print(f"Cache entries after clear: {len(cache)}")
