#!/usr/bin/env python3
"""
Antigravity Orchestrator
Parallel task execution with caching and semaphore-based concurrency control
"""

import asyncio
import hashlib
import time
import logging
from pathlib import Path
from typing import Callable, Any, Tuple, Dict


class AntigravityOrchestrator:
    """Orchestrator adapted for 2026_Antigravity workspace"""
    
    def __init__(
        self, 
        project_root: str = "/Users/jenkim/Downloads/2026_Antigravity", 
        n: int = 5, 
        cache_ttl: int = 3600, 
        cache_max: int = 1000
    ):
        """
        Initialize orchestrator
        
        Args:
            project_root: Root directory of the workspace
            n: Maximum concurrent tasks
            cache_ttl: Cache time-to-live in seconds
            cache_max: Maximum cache entries
        """
        self.root = Path(project_root)
        self.sem = asyncio.Semaphore(n)
        self.cache: Dict[str, Dict[str, Any]] = {}
        self.ttl = cache_ttl
        self.max = cache_max
        self.logs_dir = self.root / "logs"
        self.logs_dir.mkdir(exist_ok=True)
        self.logger = self._setup_logger()

    def _setup_logger(self) -> logging.Logger:
        """Setup logging configuration"""
        logger = logging.getLogger('AntigravityOrchestrator')
        logger.setLevel(logging.INFO)
        
        # File handler
        handler = logging.FileHandler(
            self.logs_dir / f"orchestrator_{time.strftime('%Y%m%d')}.log"
        )
        handler.setFormatter(
            logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        )
        logger.addHandler(handler)
        
        # Console handler
        console = logging.StreamHandler()
        console.setLevel(logging.INFO)
        console.setFormatter(logging.Formatter('%(levelname)s - %(message)s'))
        logger.addHandler(console)
        
        return logger

    def _key(self, func: Callable, *args, **kwargs) -> str:
        """
        Generate cache key from function and arguments
        
        Args:
            func: Function to cache
            *args: Positional arguments
            **kwargs: Keyword arguments
            
        Returns:
            MD5 hash of function signature
        """
        s = f"{func.__name__}:{args}:{sorted(kwargs.items())}"
        return hashlib.md5(s.encode()).hexdigest()

    def _clean(self) -> None:
        """Remove expired cache entries and enforce size limit"""
        now = time.time()
        
        # Remove expired entries
        self.cache = {
            k: v for k, v in self.cache.items() 
            if now - v['time'] < self.ttl
        }
        
        # Enforce size limit
        if len(self.cache) > self.max:
            items = sorted(self.cache.items(), key=lambda x: x[1]['time'])
            keep = int(self.max * 0.8)
            self.cache = dict(items[-keep:])
            self.logger.info(f"Cache cleaned: {len(self.cache)}/{self.max} entries")

    async def run(self, tasks: list) -> list:
        """
        Execute tasks in parallel with caching
        
        Args:
            tasks: List of (func, args, kwargs) tuples
            
        Returns:
            List of results in same order as tasks
        """
        self.logger.info(f"Starting {len(tasks)} tasks with max {self.sem._value} concurrent")
        
        async def work(func: Callable, args: tuple, kwargs: dict) -> Any:
            k = self._key(func, *args, **kwargs)
            
            # Check cache
            if k in self.cache:
                self.logger.debug(f"Cache hit: {func.__name__}")
                return self.cache[k]['data']

            # Execute with semaphore
            async with self.sem:
                self.logger.debug(f"Executing: {func.__name__}")
                
                # Support both sync and async functions
                if asyncio.iscoroutinefunction(func):
                    r = await func(*args, **kwargs)
                else:
                    r = func(*args, **kwargs)

                # Cache result
                self.cache[k] = {'data': r, 'time': time.time()}
                self._clean()
                return r

        results = await asyncio.gather(*[work(f, a, k) for f, a, k in tasks])
        self.logger.info(f"Completed {len(tasks)} tasks")
        return results

    def cache_stats(self) -> dict:
        """Get cache statistics"""
        return {
            'entries': len(self.cache),
            'max_size': self.max,
            'ttl': self.ttl,
            'usage_percent': (len(self.cache) / self.max * 100) if self.max > 0 else 0
        }

    def clear_cache(self) -> None:
        """Clear all cache entries"""
        self.cache = {}
        self.logger.info("Cache cleared")


# Example usage
if __name__ == "__main__":
    async def example_task(n: int) -> str:
        """Example async task"""
        await asyncio.sleep(0.1)
        return f"Task {n} completed"
    
    async def main():
        orch = AntigravityOrchestrator()
        
        # Create tasks
        tasks = [(example_task, (i,), {}) for i in range(10)]
        
        # Run in parallel
        results = await orch.run(tasks)
        print(results)
        
        # Show stats
        print(f"Cache stats: {orch.cache_stats()}")
    
    asyncio.run(main())
