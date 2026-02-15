import { dbConnect } from "@/lib/db";
import NotesClient from "@/app/components/NotesClient";
import Note from "@/models/Note";

async function getNotes() {
  await dbConnect();
  const notes = await Note.find({}).sort({ createdAt: -1 }).lean();

  return notes.map((note) => ({
    _id: note._id.toString(),
    title: note.title,
    content: note.content,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  }));
}
export default async function Home() {
  await dbConnect();

  const notes = await getNotes();

  return (
    <div className="container mx-auto p-4">
      <h1>Notes Taking App</h1>
      <NotesClient initialNotes={notes} />
    </div>
  );
}
