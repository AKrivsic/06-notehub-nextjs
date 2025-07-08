import { Note } from "@/types/note";
import css from "./NoteItem.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

type Props = {
  note: Note;
};

const NoteItem = ({ note }: Props) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteNote(note.id),
    onSuccess: () => {
      toast.success("Note deleted!");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: () => {
      toast.error("Failed to delete note.");
    },
  });

  return (
    <li className={css.item}>
      <div className={css.header}>
        <h2 className={css.title}>{note.title}</h2>
        <p className={css.date}>
          {new Date(note.createdAt).toLocaleDateString()}
        </p>
      </div>
      <p className={css.content}>{note.content}</p>
      <div className={css.actions}>
        <Link className={css.link} href={`/notes/${note.id}`}>
          View details
        </Link>
        <button className={css.button} onClick={() => mutation.mutate()}>
          Delete
        </button>
      </div>
    </li>
  );
};

export default NoteItem;
