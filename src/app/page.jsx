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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Check, Trash, Pencil } from "lucide-react";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      setFirstname(user.firstname || "");
      setLastname(user.lastname || "");
      setBirthdate(user.birthdate || "");

      // Validasi address
      const userAddress = user.address || {};
      setStreet(userAddress.street || "");
      setCity(userAddress.city || "");
      setProvince(userAddress.province || "");
      setPostalCode(userAddress.postal_code || "");
    } else {
      setFirstname("");
      setLastname("");
      setBirthdate("");
      setStreet("");
      setCity("");
      setProvince("");
      setPostalCode("");
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  const saveUser = async () => {
    const userData = {
      firstname,
      lastname,
      birthdate,
      address: { street, city, province, postal_code: postalCode },
    };
    const method = editingUser ? "PUT" : "POST";
    const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const updatedUser = await response.json();

      if (editingUser) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          )
        );
      } else {
        setUsers((prevUsers) => [...prevUsers, updatedUser]);
      }

      closeModal();
      fetchUsers();
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await fetch(`/api/users/${id}`, { method: "DELETE" });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg">
        <CardHeader className="p-4 flex justify-between items-center bg-blue-500 text-white rounded-t-lg">
          <h1 className="text-2xl font-bold">User List</h1>
          <Button
            onClick={() => openModal()}
            className="bg-white text-blue-500"
          >
            Add User
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <ul className="space-y-2">
              {users.map((user, index) => (
                <li
                  key={user.id || index}
                  className="flex items-center justify-between p-3 rounded-lg shadow border bg-gray-50 hover:bg-gray-100 transition"
                >
                  <span className="text-sm font-medium flex-1 text-gray-800">
                    {user.firstname} {user.lastname} -{" "}
                    {user.address?.city || "No Address"}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openModal(user)}
                    >
                      <Pencil className="h-5 w-5 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteUser(user.id)}
                    >
                      <Trash className="h-5 w-5 text-red-600" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="p-6 rounded-lg shadow-lg bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800 mb-4">
              {editingUser ? "Edit User" : "Add User"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter First Name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Input
              placeholder="Enter Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Input
              placeholder="Select Birthdate"
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Input
              placeholder="Enter Street Address"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Input
              placeholder="Enter City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Input
              placeholder="Enter Province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Input
              placeholder="Enter Postal Code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <DialogFooter className="mt-6 flex justify-end space-x-4">
            <Button
              variant="ghost"
              onClick={closeModal}
              className="text-gray-600"
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-indigo-700"
              onClick={saveUser}
            >
              {editingUser ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
