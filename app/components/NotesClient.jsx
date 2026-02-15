"use client";
import { useState } from "react";
import toast from "react-hot-toast";

const NotesClient = ({ initialNotes }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const createNote = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });
      const result = await response.json();
      setNotes([result.data, ...notes]);
      toast.success("Note created successfully");
      setTitle("");
      setContent("");
      setLoading(false);
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note");
      setLoading(false);
    }
  };
  const deleteNote = async (id) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      // Remove from UI regardless — if server says "not found", it's already gone
      setNotes(notes.filter((note) => note._id !== id));
      if (result.success) {
        toast.success("Note deleted successfully");
      } else {
        toast.success("Note removed");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };
  const startEdit = (note) => {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };
  const updateNote = async (id) => {
    if (!editTitle.trim() || !editContent.trim()) {
      return;
    }
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });
      const result = await response.json();
      if (result.success) {
        setNotes(notes.map((note) => (note._id === id ? result.data : note)));
        toast.success("Note updated successfully");
        cancelEdit();
        setLoading(false);
        setTitle("");
        setContent("");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    }
  };
  return (
    <div>
      <form onSubmit={createNote} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl text-gray-800 font font-semibold mb-4">
          Create New Note
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-gray-800 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            placeholder="Note Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full text-gray-800 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
        >
          {loading ? "Creating..." : "Create Note"}
        </button>
      </form>
      <div className="space-y-2">
        <h2 className="text-xl text-gray-800 font font-semibold mb-4">
          Your Notes ({notes.length})
        </h2>
        {notes.length === 0 ? (
          <p className="text-gray-500">No Notes Found</p>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="bg-white p-6 rounded-lg shadow-md">
              {editingId === note._id ? (
                <>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Note Title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full text-gray-800 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <textarea
                      placeholder="Note Content"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={4}
                      className="w-full text-gray-800 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateNote(note._id)}
                        className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => cancelEdit(note._id)}
                        className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {note.title}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(note)}
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteNote(note._id)}
                        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600">{note.content}</p>
                  <p className="text-gray-500">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                  {note.createdAt !== note.updatedAt && (
                    <p className="text-gray-500">
                      Updated: {new Date(note.updatedAt).toLocaleString()}
                    </p>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesClient;
