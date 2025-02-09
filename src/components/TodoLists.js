import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TodoList() {
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

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Todo List</h1>
      <div className="flex gap-2 mb-4">
        <Input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Tambahkan tugas..."
        />
        <Button onClick={addTask}>Tambah</Button>
      </div>
      {tasks.map((t) => (
        <Card key={t.id} className="p-2">
          {t.text}
        </Card>
      ))}
    </div>
  );
}
