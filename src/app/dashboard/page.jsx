"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  useEffect(() => {
    fetch("/api/todos")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  const addTask = async () => {
    if (task.trim() !== "") {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: task }),
      });
      if (response.ok) {
        setTask("");
        fetch("/api/todos")
          .then((res) => res.json())
          .then((data) => setTasks(data));
      }
    }
  };

  const deleteTask = async (id) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Tambahkan tugas..."
              className="flex-1"
            />
            <Button onClick={addTask} className="bg-blue-500 hover:bg-blue-600">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          <div className="space-y-2">
            {tasks.length > 0 ? (
              tasks.map((t) => (
                <Card
                  key={t.id}
                  className="flex justify-between items-center p-3 border border-gray-200 rounded-lg shadow-md"
                >
                  <span className="text-gray-800 font-medium">{t.text}</span>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="border-gray-400 hover:border-gray-600"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => deleteTask(t.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500">Belum ada tugas</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
