'use client';
import React, { useState, useEffect, useRef } from 'react'
import { Search, Loader2, X, Music } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAlbums, setSelectedAlbums] = useState([]);
  const [open, setOpen] = useState(false);
  
  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedAlbums');
      if (saved) {
        try {
          setSelectedAlbums(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse saved albums', e);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedAlbums', JSON.stringify(selectedAlbums));
    }
  }, [selectedAlbums]);

  const handleSearch = async (query) => {
    if (!query?.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/discogs/search?q=${encodeURIComponent(query)}&type=master&key=${process.env.DISCOGS_KEY}&secret=${process.env.DISCOGS_SECRET}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search');
      }

      setResults(data.results || []);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectAlbum = (album) => {
    if (!selectedAlbums.find(a => a.id === album.id)) {
      setSelectedAlbums([...selectedAlbums, album]);
    }
    setOpen(false);
    setSearchQuery('');
  };

  const removeAlbum = (albumId) => {
    setSelectedAlbums(selectedAlbums.filter(a => a.id !== albumId));
  };

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="relative mb-6">
          <Command shouldFilter={false} className="rounded-xl border shadow-md relative overflow-visible z-50">
            <CommandInput 
              placeholder="Add album..." 
              value={searchQuery}
              className="text-base"
              onValueChange={(val) => {
                setSearchQuery(val);
                setOpen(!!val);
              }}
              onFocus={() => setOpen(!!searchQuery)}
            />
            {open && (results.length > 0 || loading) && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border bg-popover shadow-md overflow-hidden animate-in fade-in-0 zoom-in-95">
                <CommandList>
                  {loading && (
                    <div className="py-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Searching Discogs...
                    </div>
                  )}
                  {!loading && results.length === 0 && (
                     <div className="py-6 text-center text-sm text-muted-foreground">
                      No albums found.
                    </div>
                  )}
                  {!loading && results.slice(0, 5).map((album) => (
                    <CommandItem
                      key={album.id}
                      value={album.title}
                      onSelect={() => handleSelectAlbum(album)}
                      className="cursor-pointer flex items-center justify-between py-3 px-4"
                    >
                      <div className="flex items-center gap-3">
                        <Music className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{album.title}</span>
                        {album.year && (
                          <span className="text-muted-foreground text-xs">
                            ({album.year})
                          </span>
                        )}
                      </div>
                      {/* <span className="text-sm text-muted-foreground">
                        {album.artist || 'Unknown Artist'}
                      </span> */}
                    </CommandItem>
                  ))}
                </CommandList>
              </div>
            )}
          </Command>
        </div>

        {selectedAlbums.length > 0 && (
          <div className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 md:gap-x-4 md:gap-y-1 px-2">
              {selectedAlbums.map((album) => (
                <Card 
                  key={album.id} 
                  onDoubleClick={() => removeAlbum(album.id)}
                  className="group overflow-hidden border-0 bg-transparent shadow-none hover:scale-105 transition-transform duration-300 cursor-pointer p-1 gap-0"
                >
                  <div className="relative aspect-square overflow-hidden mb-0 md:mb-3 bg-muted shadow-lg rounded-none md:rounded-xl">
                    {album.cover_image ? (
                      <img
                        src={album.cover_image}
                        alt={album.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary">
                        <Music className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home;
