
import asyncio
import json
import os
import hashlib
from typing import Dict, Any, List, Optional
from dataclasses import dataclass
from datetime import datetime

# Configuration
CACHE_DIR = ".cache/orchestrator"
MAX_CONCURRENCY = 3

@dataclass
class TaskResult:
    task_id: str
    status: str
    result: Any
    timestamp: str
    model_used: str

class CacheManager:
    def __init__(self, cache_dir: str):
        self.cache_dir = cache_dir
        os.makedirs(cache_dir, exist_ok=True)

    def _get_hash(self, key: str) -> str:
        return hashlib.md5(key.encode()).hexdigest()

    def get(self, key: str) -> Optional[Any]:
        hashed = self._get_hash(key)
        path = os.path.join(self.cache_dir, f"{hashed}.json")
        if os.path.exists(path):
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"[Cache] Error reading {key}: {e}")
        return None

    def set(self, key: str, value: Any):
        hashed = self._get_hash(key)
        path = os.path.join(self.cache_dir, f"{hashed}.json")
        try:
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(value, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"[Cache] Error saving {key}: {e}")

class AIOrchestrator:
    def __init__(self):
        self.cache = CacheManager(CACHE_DIR)
        self.semaphore = asyncio.Semaphore(MAX_CONCURRENCY)

    async def call_lightweight_model(self, prompt: str) -> str:
        """Simulates calling a fast, cheap model (e.g., GPT-3.5-Turbo, Haiku)"""
        # In a real scenario, this would call an API
        await asyncio.sleep(0.5) # Simulate network latency
        return f"[Lightweight Summary] Processed: {prompt[:30]}..."

    async def call_heavy_model(self, prompt: str) -> str:
        """Simulates calling a reasoning model (e.g., GPT-4, Opus)"""
        # In a real scenario, this would call an API
        await asyncio.sleep(1.5) # Simulate processing time
        return f"[Heavy Analysis] Deep dive into: {prompt} completed."

    async def process_subtask(self, task_id: str, prompt: str) -> TaskResult:
        """Executes a subtask with caching and concurrency control"""
        cached = self.cache.get(prompt)
        if cached:
            print(f"[{task_id}] Cache Hit")
            return TaskResult(**cached)

        async with self.semaphore:
            print(f"[{task_id}] Processing...")
            # Decide model based on complexity (simple heuristic here)
            if len(prompt) < 50:
                result = await self.call_lightweight_model(prompt)
                model = "Lightweight"
            else:
                result = await self.call_heavy_model(prompt)
                model = "Heavy"
            
            output = TaskResult(
                task_id=task_id,
                status="success",
                result=result,
                timestamp=datetime.now().isoformat(),
                model_used=model
            )
            
            # Save to cache (convert dataclass to dict)
            self.cache.set(prompt, output.__dict__)
            return output

    async def run_mission(self, inputs: List[str]):
        print(f"--- Starting Mission with {len(inputs)} tasks ---")
        tasks = []
        for i, prompt in enumerate(inputs):
            task_id = f"Task-{i+1}"
            tasks.append(self.process_subtask(task_id, prompt))
        
        results = await asyncio.gather(*tasks)
        
        print("\n--- Mission Consolidated Report ---")
        for res in results:
            print(f"[{res.task_id}] ({res.model_used}): {res.result}")

async def main():
    orchestrator = AIOrchestrator()
    
    # Example Inputs
    inputs = [
        "Simple greeting",
        "Short status check",
        "Complex debugging request for the Highcharts initialization error in React application",
        "Another simple check",
        "Analyze the performance impact of large Excel files on frontend rendering",
    ]
    
    await orchestrator.run_mission(inputs)

if __name__ == "__main__":
    asyncio.run(main())
