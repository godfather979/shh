import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [cases, setCases] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState('all');
    const [similarCases, setSimilarCases] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:5000/get-all'
                );
                setCases(response.data);
            } catch (error) {
                console.error('Error fetching cases:', error);
            }
        };

        fetchData();
    }, []);

    const handleSimilarSearch = async () => {
        try {
            const response = await axios.post(
                'http://localhost:5000/get-similar-cases',
                { summary: searchTerm },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            setSimilarCases(response.data);
        } catch (error) {
            console.error('Error fetching similar cases:', error);
        }
    };

    const filteredCases = cases.filter(
        legalCase =>
            legalCase.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedClass === 'all' ||
                selectedClass === '' ||
                legalCase.classification === selectedClass)
    );

    const uniqueClassifications = [
        ...new Set(cases.map(c => c.classification)),
    ];

    const handleCardClick = legalCase => {
        navigate('/dashboard/docview', {
            state: {
                title: legalCase.title,
                classification: legalCase.classification,
                summary: legalCase.summary,
                url: legalCase.pdf_link,
            },
        });
    };

    return (
        <div className='flex'>
            <div className='flex w-full min-h-screen bg-white'>
                <main className='flex-1 p-6'>
                    <h1 className='text-3xl font-bold mb-6'>
                        Legal Cases Dashboard
                    </h1>
                    <div className='mb-6 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0'>
                        <div className='relative flex flex-1'>
                            <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
                            <Input
                                placeholder='Search cases...'
                                className='pl-8'
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <Button
                                className='ml-4'
                                onClick={handleSimilarSearch}
                            >
                                Find Similar Cases
                            </Button>
                        </div>
                        <Select
                            value={selectedClass}
                            onValueChange={setSelectedClass}
                        >
                            <SelectTrigger className='w-[180px]'>
                                <SelectValue placeholder='All Classifications' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='all'>
                                    All Classifications
                                </SelectItem>
                                {uniqueClassifications.map(classification => (
                                    <SelectItem
                                        key={classification}
                                        value={classification}
                                    >
                                        {classification}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                        {(similarCases.length > 0
                            ? similarCases
                            : filteredCases
                        ).map(legalCase => (
                            <div
                                onClick={() => handleCardClick(legalCase)}
                                key={legalCase.id}
                                className='transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer'
                            >
                                <Card className='h-full'>
                                    <CardHeader>
                                        <CardTitle>{legalCase.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className='text-sm font-medium mb-2'>
                                            {legalCase.classification}
                                        </p>
                                        <p className='text-sm text-muted-foreground line-clamp-5'>
                                            {legalCase.summary}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
