import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import data from '../lib/data.json';
import { FieldGuidanceModal } from '@/components/FieldGuidanceModal';
import { getFieldGuidance } from '@/lib/gemini';
import { InfoIcon } from 'lucide-react';

export default function CreateForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const { category } = location.state || {};
    const [selectedField, setSelectedField] = useState(null);
    const [fieldGuidance, setFieldGuidance] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formData = data[category];

    if (!formData) {
        return <div>No form data found for this category.</div>;
    }

    const handleInfoClick = async fieldName => {
        setSelectedField(fieldName);
        const guidance = await getFieldGuidance(
            fieldName,
            formData.title,
            formData.description
        );
        setFieldGuidance(guidance);
        setIsModalOpen(true);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const entries = Array.from(formData.entries());
        const formValues = {};

        for (let [key, value] of entries) {
            if (value instanceof File && value.size > 0) {
                // Convert file to base64
                formValues[key] = await toBase64(value);
            } else {
                formValues[key] = value;
            }
        }

        navigate(`${location.pathname}/text-editor`, {
            state: { formValues, category },
        });
    };

    const toBase64 = file =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });

    const fieldPairs = [];
    for (let i = 0; i < formData.fields.length; i += 2) {
        fieldPairs.push(formData.fields.slice(i, i + 2));
    }

    const [preview, setPreview] = useState(null);

    // In handleSubmit or onChange of file input
    const onFileChange = e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // In JSX:
    {
        preview && <img src={preview} className='max-h-40 mt-4' />;
    }

    return (
        <div className='container mx-auto px-10 py-10'>
            <h1 className='text-3xl font-bold text-center mb-10'>
                {formData.title}
            </h1>
            <p className='text-center mb-10'>{formData.description}</p>
            <form className='space-y-6' onSubmit={handleSubmit}>
                {fieldPairs.map((pair, rowIndex) => (
                    <div
                        key={rowIndex}
                        className='grid grid-cols-1 md:grid-cols-2 gap-6'
                    >
                        {pair.map((field, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className='space-y-2'
                            >
                                <div className='flex items-center'>
                                    <Label>{field.label}</Label>
                                    <InfoIcon
                                        className='ml-2 w-4 h-4 text-gray-500 
                      transition-all duration-200 ease-in-out
                      hover:text-blue-600 hover:scale-110
                      active:text-blue-700 active:scale-95
                      cursor-pointer'
                                        onClick={() =>
                                            handleInfoClick(field.label)
                                        }
                                    />
                                </div>
                                <Input
                                    name={field.label
                                        .toLowerCase()
                                        .replace(/[^a-z0-9]/gi, '_')}
                                    type={field.type}
                                    placeholder={field.placeholder || ''}
                                    required
                                />
                            </div>
                        ))}
                    </div>
                ))}
                <Button type='submit' className='w-full mt-6'>
                    Submit
                </Button>
            </form>

            <FieldGuidanceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                fieldName={selectedField}
                guidance={fieldGuidance}
            />
        </div>
    );
}
