"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Trash, Pencil } from "lucide-react";

const userSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  birthdate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    province: z.string().min(1, "Province is required"),
    postal_code: z.string().min(1, "Postal code is required"),
  }),
});

export default function UserList() {
  const [alertOpen, setAlertOpen] = useState(false);
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
  const [errors, setErrors] = useState({});
  const [userToDelete, setUserToDelete] = useState(null);

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
    setErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
    setErrors({});
  };

  const validateInputs = () => {
    try {
      userSchema.parse({
        firstname,
        lastname,
        birthdate,
        address: { street, city, province, postal_code: postalCode },
      });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors = err.flatten().fieldErrors;
        const addressErrors = fieldErrors["address"] || {};
        setErrors({
          firstname: fieldErrors.firstname?.[0],
          lastname: fieldErrors.lastname?.[0],
          birthdate: fieldErrors.birthdate?.[0],
          address: {
            street: addressErrors.street?.[0],
            city: addressErrors.city?.[0],
            province: addressErrors.province?.[0],
            postal_code: addressErrors.postal_code?.[0],
          },
        });
      }
      return false;
    }
  };

  const saveUser = async () => {
    if (!validateInputs()) return;
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

  const confirmDeleteUser = (id) => {
    setUserToDelete(id);
    setAlertOpen(true);
  };

  const deleteUser = async (id) => {
    if (!userToDelete) return;

    try {
      await fetch(`/api/users/${userToDelete}`, { method: "DELETE" });
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userToDelete)
      );
      setAlertOpen(false);
      setUserToDelete(null);
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
                      onClick={() => confirmDeleteUser(user.id)}
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
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="p-6 rounded-lg shadow-lg bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user and their data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setAlertOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-red-500 text-white" onClick={deleteUser}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="p-6 rounded-lg shadow-lg bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800 mb-4">
              {editingUser ? "Edit User" : "Add User"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <Input
                placeholder="First Name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
              {errors.firstname && (
                <p className="text-sm text-red-600">{errors.firstname}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <Input
                placeholder="Last Name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
              {errors.lastname && (
                <p className="text-sm text-red-600">{errors.lastname}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Birthdate
              </label>
              <Input
                placeholder="Birthdate"
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
              />
              {errors.birthdate && (
                <p className="text-sm text-red-600">{errors.birthdate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Street
              </label>
              <Input
                placeholder="Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
              {errors.address?.street && (
                <p className="text-sm text-red-600">{errors.address.street}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <Input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              {errors.address?.city && (
                <p className="text-sm text-red-600">{errors.address.city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Province
              </label>
              <Input
                placeholder="Province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              />
              {errors.address?.province && (
                <p className="text-sm text-red-600">
                  {errors.address.province}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <Input
                placeholder="Postal Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
              {errors.address?.postal_code && (
                <p className="text-sm text-red-600">
                  {errors.address.postal_code}
                </p>
              )}
            </div>
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
