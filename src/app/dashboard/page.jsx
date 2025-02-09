"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Check, Trash } from "lucide-react";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch("/api/todos");
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask }),
      });
      const newTodo = await response.json();
      setTodos((prevTodos) => [
        ...prevTodos,
        { ...newTodo, id: newTodo.id || crypto.randomUUID() },
      ]);
      setNewTask("");
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const todo = todos.find((t) => t.id === id);
      const response = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      const updatedTodo = await response.json();
      setTodos((prevTodos) =>
        prevTodos.map((t) =>
          t.id === id ? { ...t, completed: updatedTodo.completed } : t
        )
      );
    } catch (error) {
      console.error("Failed to toggle task completion:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`/api/todos/${id}`, { method: "DELETE" });
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <Card className="w-full max-w-md bg-white shadow-md rounded-lg">
        <CardHeader className="p-4">
          <h1 className="text-2xl font-bold text-center">Todo List</h1>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a new task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addTask}>Add</Button>
          </div>
          {loading ? (
            <p className="text-center text-gray-500 mt-4">Loading...</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className={`flex items-center justify-between p-2 rounded-lg shadow-sm border ${
                    todo.completed ? "bg-green-100" : "bg-white"
                  }`}
                >
                  <span
                    className={`text-sm font-medium flex-1 ${
                      todo.completed
                        ? "line-through text-gray-500"
                        : "text-gray-800"
                    }`}
                  >
                    {todo.title}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleComplete(todo.id)}
                    >
                      <Check
                        className={`h-5 w-5 ${
                          todo.completed ? "text-green-600" : "text-gray-400"
                        }`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(todo.id)}
                    >
                      <Trash className="h-5 w-5 text-red-600" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        <CardFooter className="p-4">
          <p className="text-sm text-gray-500 text-center">
            {todos.length === 0
              ? "No tasks yet. Add a task to get started!"
              : `${todos.length} task${todos.length > 1 ? "s" : ""} remaining.`}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
