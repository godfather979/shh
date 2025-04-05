import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Search, Calendar, RefreshCw } from "lucide-react";

export default function News() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");

  const fetchNews = (forceRefresh = false) => {
    const savedNews = localStorage.getItem('newsData');
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

    if (!forceRefresh && savedNews) {
      const { articles, timestamp } = JSON.parse(savedNews);
      if (Date.now() - timestamp < oneHour) {
        setNewsItems(articles);
        return;
      }
    }

    fetch("http://127.0.0.1:8000/api/news")
      .then(response => response.json())
      .then(data => {
        setNewsItems(data.articles);
        localStorage.setItem('newsData', JSON.stringify({
          articles: data.articles,
          timestamp: Date.now()
        }));
      })
      .catch(error => console.error("Error fetching news:", error));
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  const openSummaryModal = (title, summary) => {
    setSelectedTitle(title);
    setSelectedSummary(summary);
    setModalOpen(true);
  };

  const handleRefresh = () => {
    fetchNews(true);
    setSearchTerm("");
    setSelectedDate("");
    setSelectedTags([]);
  };

  const availableTags = [...new Set(newsItems
    .flatMap(item => item.keywords.split(", "))
    .filter(tag => !selectedTags.includes(tag))
  )];

  const isNewsItemVisible = (newsItem) => {
    const matchesSearch =
      newsItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      newsItem.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = selectedDate === "" || 
      new Date(newsItem.datetime).toISOString().split("T")[0] === selectedDate;
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => newsItem.keywords.includes(tag));

    return matchesSearch && matchesDate && matchesTags;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          <Select onValueChange={handleTagSelect}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Add tag..." />
            </SelectTrigger>
            <SelectContent>
              {availableTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="pl-10"
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="px-3"
            >
              <RefreshCw size={18} />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="default"
              className="cursor-pointer px-3 py-1 text-base"
            >
              {tag}
              <X
                size={16}
                className="ml-2 inline-block"
                onClick={() => removeTag(tag)}
              />
            </Badge>
          ))}
          {selectedTags.length > 0 && (
            <Badge 
              variant="destructive" 
              className="cursor-pointer px-3 py-1 text-base"
              onClick={clearAllTags}
            >
              Clear All
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {newsItems.filter(isNewsItemVisible).map((newsItem) => (
          <Card key={newsItem.link} className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-bold truncate">
                <a href={newsItem.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {newsItem.title}
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <img
                  src={`./${Math.floor(Math.random() * 5) + 1}.jpg`}
                  alt={newsItem.title}
                  className="object-cover rounded-lg"
                />
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                {newsItem.description}
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => openSummaryModal(newsItem.title, newsItem.summary)}
              >
                View Summary
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between items-center text-sm text-gray-500">
              <span>{newsItem.media}</span>
              <span>{new Date(newsItem.datetime).toLocaleString()}</span>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">{selectedTitle}</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <p className="text-sm text-gray-600">{selectedSummary}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}