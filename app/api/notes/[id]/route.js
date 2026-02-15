import { dbConnect } from "@/lib/db";
import Note from "@/models/Note";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const note = await Note.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true },
    );
    if (!note) {
      return NextResponse.json(
        { success: false, message: "Note not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      success: true,
      message: "Note updated successfully",
      data: note,
    });
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update note" },
      { status: 400 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const note = await Note.findByIdAndDelete(id);
    if (!note) {
      return NextResponse.json(
        { success: false, message: "Note not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete note" },
      { status: 400 },
    );
  }
}
