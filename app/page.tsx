"use client";

import { useMemo, useState } from "react";

/** Demo launch target aligned with the course scenario (“發佈會就在幾週後”). */
const LAUNCH_DATE = new Date("2026-04-18T12:00:00+08:00");

function daysUntilLaunch(now: Date = new Date()): number {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(LAUNCH_DATE);
  end.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  const { doneCount, total } = useMemo(() => {
    const done = todos.filter((t) => t.done).length;
    return { doneCount: done, total: todos.length };
  }, [todos]);

  const launchDelta = useMemo(() => daysUntilLaunch(), []);

  function addTodo() {
    const text = input.trim();
    if (!text) return;
    setTodos([...todos, { id: Date.now(), text, done: false }]);
    setInput("");
  }

  function toggleTodo(id: number) {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function deleteTodo(id: number) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  return (
    <main className="max-w-md mx-auto mt-16 px-4 font-sans">
      <section
        className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm dark:border-amber-900/60 dark:bg-amber-950/40"
        aria-label="Pre-launch status"
      >
        {launchDelta > 0 ? (
          <p className="font-medium text-amber-950 dark:text-amber-100">
            產品發佈倒數：<span className="tabular-nums">{launchDelta}</span> 天
          </p>
        ) : launchDelta === 0 ? (
          <p className="font-medium text-amber-950 dark:text-amber-100">今天是發佈日，加油最後衝刺！</p>
        ) : (
          <p className="font-medium text-amber-950 dark:text-amber-100">發佈日已過——持續迭代中。</p>
        )}
        <p className="mt-1 text-amber-900/80 dark:text-amber-200/80">
          團隊待辦完成度：
          <span className="tabular-nums font-medium">
            {total === 0 ? "尚無項目" : `${doneCount} / ${total} 已完成`}
          </span>
        </p>
      </section>

      <h1 className="text-2xl font-bold mb-6">SADo App</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="What needs to be done?"
          className="flex-1 px-3 py-2 text-base border border-gray-300"
        />
        <button onClick={addTodo} className="px-4 py-2 text-base border border-gray-300">
          Add
        </button>
      </div>

      {todos.length === 0 && <p className="text-gray-400">No todos yet.</p>}

      <ul className="list-none p-0 m-0">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-2 py-2 border-b border-gray-100"
          >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
            />
            <span className={`flex-1 ${todo.done ? "line-through text-gray-400" : ""}`}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)} className="text-xs px-2 py-1 border border-gray-300">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
