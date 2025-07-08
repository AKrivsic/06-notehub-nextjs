'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import type { FetchNotesResponse } from '@/lib/api';
import { Toaster } from 'react-hot-toast';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import NoteModal from '@/components/NoteModal/NoteModal';
import toast from 'react-hot-toast';
import css from './page.module.css';

const PER_PAGE = 12;

export default function NotesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', page, debouncedSearch],
    refetchOnMount: false,
      queryFn: () => {
    const params: {
      page: number;
      perPage: number;
      search?: string;
    } = {
      page,
      perPage: PER_PAGE,
    };
    if (debouncedSearch.trim() !== '') {
      params.search = debouncedSearch;
    }
    return fetchNotes(params);
  },
  placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (error) toast.error('Unable to connect');
  }, [error]);

  useEffect(() => {
    if (data && data.notes.length === 0) {
      toast.error('No notes found for your request.');
    }
  }, [data, debouncedSearch]);
    
     const totalPages = data?.totalPages || 1;

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }} />
        {totalPages > 1 && (
          <Pagination pageCount={totalPages} onPageChange={({ selected }) => setPage(selected + 1)} />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {!isLoading && !error && data && data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}

      {isModalOpen && (
        <NoteModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}