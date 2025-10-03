import React, { useState } from 'react';
import { gemAPI } from '../services/api';

const AddGem = () => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        hindiName: '',
        planet: '',
        planetHindi: '',
        color: '',
        hardness: '',
        metal: '',
        finger: '',
        day: '',
        mantra: '',
        emoji: '',
        gradient: '',
        bgColor: '',
        borderColor: '',
        textColor: '',
        description: '',
        astrologicalSignificance: '',
        benefits: [],
        features: {
            color: '',
            hardness: '',
            cut: '',
            bestMetal: ''
        },
        history: '',
        suitableFor: [],
        price: '',
        sizeWeight: '',
        sizeUnit: 'carat',
        discount: '',
        discountType: 'percentage',
        images: [],
        uploadedImages: [],
        stock: '',
        availability: true,
        certification: '',
        origin: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Astrological planets
    const planets = [
        'Sun (Surya)', 'Moon (Chandra)', 'Mars (Mangal)', 'Mercury (Budh)',
        'Jupiter (Guru)', 'Venus (Shukra)', 'Saturn (Shani)', 'Rahu', 'Ketu'
    ];

    // Common gem categories
    const gemCategories = [
        'Sapphire', 'Ruby', 'Emerald', 'Diamond', 'Pearl', 'Coral',
        'Hessonite', 'Opal', 'Topaz', 'Amethyst', 'Citrine', 'Garnet',
        'Moonstone', 'Turquoise', 'Peridot', 'Aquamarine', 'Tourmaline'
    ];

    // Common benefits
    const commonBenefits = [
        'Enhances intelligence and communication skills',
        'Improves business acumen and analytical ability',
        'Brings mental clarity and focus',
        'Strengthens interpersonal skills',
        'Reduces anxiety and overthinking',
        'Improves memory retention',
        'Enhances negotiation skills',
        'Financial Prosperity',
        'Health & Healing',
        'Spiritual Growth',
        'Protection',
        'Love & Relationships',
        'Career Success',
        'Peace & Harmony',
        'Courage & Strength',
        'Wisdom & Knowledge',
        'Creativity',
        'Communication'
    ];

    // Suitable for professions
    const suitableProfessions = [
        'Teachers', 'Lawyers', 'Writers', 'Media professionals', 'Finance experts',
        'Communication specialists', 'Students', 'Businessmen', 'Doctors', 'Engineers',
        'Scientists', 'Artists', 'Politicians', 'Consultants', 'Entrepreneurs'
    ];

    // Gradient options for styling
    const gradientOptions = [
        'from-blue-600 to-sapphire-700',
        'from-red-600 to-ruby-700',
        'from-green-600 to-emerald-700',
        'from-white-600 to-diamond-700',
        'from-yellow-600 to-topaz-700',
        'from-purple-600 to-amethyst-700',
        'from-pink-600 to-pearl-700',
        'from-orange-600 to-coral-700'
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            if (name === 'suitableFor' || name === 'benefits') {
                setFormData(prev => ({
                    ...prev,
                    [name]: checked
                        ? [...prev[name], value]
                        : prev[name].filter(item => item !== value)
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    [name]: checked
                }));
            }
        } else if (name.startsWith('features.')) {
            // Handle nested features object
            const featureKey = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                features: {
                    ...prev.features,
                    [featureKey]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleArrayInputChange = (field, value) => {
        if (value.trim() && !formData[field].includes(value.trim())) {
            setFormData(prev => ({
                ...prev,
                [field]: [...prev[field], value.trim()]
            }));
        }
    };

    const removeArrayItem = (field, item) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter(i => i !== item)
        }));
    };

    const handleImageUrlAdd = (e) => {
        e.preventDefault();
        const input = e.target.previousElementSibling;
        if (input.value.trim()) {
            handleArrayInputChange('images', input.value);
            input.value = '';
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => {
            const isValidType = file.type.startsWith('image/');
            const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
            return isValidType && isValidSize;
        });

        if (validFiles.length !== files.length) {
            setErrors(prev => ({
                ...prev,
                imageUpload: 'Some files were invalid. Only image files under 5MB are allowed.'
            }));
        }

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = {
                    id: Date.now() + Math.random(),
                    file: file,
                    preview: e.target.result,
                    name: file.name,
                    size: file.size
                };
                setFormData(prev => ({
                    ...prev,
                    uploadedImages: [...prev.uploadedImages, imageData]
                }));
            };
            reader.readAsDataURL(file);
        });

        // Clear the input
        e.target.value = '';
    };

    const removeUploadedImage = (imageId) => {
        setFormData(prev => ({
            ...prev,
            uploadedImages: prev.uploadedImages.filter(img => img.id !== imageId)
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.id.trim()) newErrors.id = 'ID is required';
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.hindiName.trim()) newErrors.hindiName = 'Hindi name is required';
        if (!formData.planet.trim()) newErrors.planet = 'Planet is required';
        if (!formData.color.trim()) newErrors.color = 'Color is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.astrologicalSignificance.trim()) newErrors.astrologicalSignificance = 'Astrological significance is required';
        if (formData.benefits.length === 0) newErrors.benefits = 'At least one benefit is required';
        if (formData.suitableFor.length === 0) newErrors.suitableFor = 'At least one suitable profession is required';
        if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
        if (!formData.sizeWeight || formData.sizeWeight <= 0) newErrors.sizeWeight = 'Valid size/weight is required';
        if (!formData.certification.trim()) newErrors.certification = 'Certification is required';
        if (!formData.origin.trim()) newErrors.origin = 'Origin is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSuccessMessage('');

        try {
            const gemData = {
                ...formData,
                price: parseFloat(formData.price),
                sizeWeight: parseFloat(formData.sizeWeight),
                discount: formData.discount ? parseFloat(formData.discount) : 0,
                stock: formData.stock ? parseInt(formData.stock) : null,
                // Combine URL images and uploaded images
                allImages: [...formData.images, ...formData.uploadedImages.map(img => img.preview)]
            };

            const response = await gemAPI.addGem(gemData);

            if (response.success) {
                setSuccessMessage('Gem added successfully!');
                // Reset form
                setFormData({
                    id: '',
                    name: '',
                    hindiName: '',
                    planet: '',
                    planetHindi: '',
                    color: '',
                    hardness: '',
                    metal: '',
                    finger: '',
                    day: '',
                    mantra: '',
                    emoji: '',
                    gradient: '',
                    bgColor: '',
                    borderColor: '',
                    textColor: '',
                    description: '',
                    astrologicalSignificance: '',
                    benefits: [],
                    features: {
                        color: '',
                        hardness: '',
                        cut: '',
                        bestMetal: ''
                    },
                    history: '',
                    suitableFor: [],
                    price: '',
                    sizeWeight: '',
                    sizeUnit: 'carat',
                    discount: '',
                    discountType: 'percentage',
                    images: [],
                    uploadedImages: [],
                    stock: '',
                    availability: true,
                    certification: '',
                    origin: ''
                });
            }
        } catch (error) {
            console.error('Error adding gem:', error);
            setErrors({ submit: error.message || 'Failed to add gem. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className=" mx-auto">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 px-6 py-4">
                        <h1 className="text-3xl font-bold text-white text-center">
                            Add New Gem
                        </h1>
                        <p className="text-emerald-100 text-center mt-2">
                            Fill in the details to add a new gem to the collection
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-8">
                        {/* Success Message */}
                        {successMessage && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                {successMessage}
                            </div>
                        )}

                        {/* Error Message */}
                        {errors.submit && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {errors.submit}
                            </div>
                        )}

                        {/* Basic Information */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                Basic Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* ID */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ID *
                                    </label>
                                    <input
                                        type="text"
                                        name="id"
                                        value={formData.id}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.id ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="e.g., emerald"
                                    />
                                    {errors.id && <p className="text-red-500 text-sm mt-1">{errors.id}</p>}
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="e.g., Emerald"
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>

                                {/* Hindi Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hindi Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="hindiName"
                                        value={formData.hindiName}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.hindiName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="e.g., Panna (पन्ना)"
                                    />
                                    {errors.hindiName && <p className="text-red-500 text-sm mt-1">{errors.hindiName}</p>}
                                </div>

                                {/* Planet */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Planet *
                                    </label>
                                    <select
                                        name="planet"
                                        value={formData.planet}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.planet ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Select Planet</option>
                                        {planets.map(planet => (
                                            <option key={planet} value={planet}>{planet}</option>
                                        ))}
                                    </select>
                                    {errors.planet && <p className="text-red-500 text-sm mt-1">{errors.planet}</p>}
                                </div>

                                {/* Planet Hindi */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Planet (Hindi)
                                    </label>
                                    <input
                                        type="text"
                                        name="planetHindi"
                                        value={formData.planetHindi}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="e.g., बुध ग्रह"
                                    />
                                </div>

                                {/* Color */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Color *
                                    </label>
                                    <input
                                        type="text"
                                        name="color"
                                        value={formData.color}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.color ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="e.g., Green"
                                    />
                                    {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
                                </div>

                                {/* Hardness */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hardness
                                    </label>
                                    <input
                                        type="text"
                                        name="hardness"
                                        value={formData.hardness}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="e.g., 7.5-8"
                                    />
                                </div>

                                {/* Metal */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Metal
                                    </label>
                                    <input
                                        type="text"
                                        name="metal"
                                        value={formData.metal}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="e.g., Gold or Silver"
                                    />
                                </div>

                                {/* Finger */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Finger
                                    </label>
                                    <input
                                        type="text"
                                        name="finger"
                                        value={formData.finger}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="e.g., Little finger of right hand"
                                    />
                                </div>

                                {/* Day */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Day
                                    </label>
                                    <input
                                        type="text"
                                        name="day"
                                        value={formData.day}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="e.g., Wednesday morning"
                                    />
                                </div>

                                {/* Mantra */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mantra
                                    </label>
                                    <input
                                        type="text"
                                        name="mantra"
                                        value={formData.mantra}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="e.g., Om Budhaya Namah"
                                    />
                                </div>

                                {/* Emoji */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Emoji
                                    </label>
                                    <input
                                        type="text"
                                        name="emoji"
                                        value={formData.emoji}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="e.g., 💚"
                                    />
                                </div>

                                {/* Gradient */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Gradient
                                    </label>
                                    <select
                                        name="gradient"
                                        value={formData.gradient}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="">Select Gradient</option>
                                        {gradientOptions.map(gradient => (
                                            <option key={gradient} value={gradient}>{gradient}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Background Color */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Background Color
                                    </label>
                                    <input
                                        type="text"
                                        name="bgColor"
                                        value={formData.bgColor}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="e.g., bg-green-50"
                                    />
                                </div>

                                {/* Border Color */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Border Color
                                    </label>
                                    <input
                                        type="text"
                                        name="borderColor"
                                        value={formData.borderColor}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="e.g., border-green-200"
                                    />
                                </div>

                                {/* Text Color */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Text Color
                                    </label>
                                    <input
                                        type="text"
                                        name="textColor"
                                        value={formData.textColor}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="e.g., text-green-800"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.description ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Describe the gem's characteristics, quality, and unique features..."
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                            </div>

                            {/* Astrological Significance */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Astrological Significance *
                                </label>
                                <textarea
                                    name="astrologicalSignificance"
                                    value={formData.astrologicalSignificance}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.astrologicalSignificance ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Describe the astrological significance and effects of this gemstone..."
                                />
                                {errors.astrologicalSignificance && <p className="text-red-500 text-sm mt-1">{errors.astrologicalSignificance}</p>}
                            </div>

                            {/* History */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    History
                                </label>
                                <textarea
                                    name="history"
                                    value={formData.history}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Historical significance and cultural background..."
                                />
                            </div>
                        </div>

                        {/* Benefits & Suitable For */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                Benefits & Suitable For
                            </h2>

                            {/* Benefits */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Benefits *
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                    {commonBenefits.map(benefit => (
                                        <label key={benefit} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="benefits"
                                                value={benefit}
                                                checked={formData.benefits.includes(benefit)}
                                                onChange={handleInputChange}
                                                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <span className="text-sm text-gray-700">{benefit}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.benefits && <p className="text-red-500 text-sm mt-1">{errors.benefits}</p>}
                            </div>

                            {/* Suitable For */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Suitable For (Professions) *
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                    {suitableProfessions.map(profession => (
                                        <label key={profession} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="suitableFor"
                                                value={profession}
                                                checked={formData.suitableFor.includes(profession)}
                                                onChange={handleInputChange}
                                                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <span className="text-sm text-gray-700">{profession}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.suitableFor && <p className="text-red-500 text-sm mt-1">{errors.suitableFor}</p>}
                            </div>
                        </div>

                        {/* Physical Features */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                Physical Features
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Color Details */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Color Details
                                    </label>
                                    <textarea
                                        name="features.color"
                                        value={formData.features.color}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="Describe the color variations and quality..."
                                    />
                                </div>

                                {/* Hardness Details */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hardness Details
                                    </label>
                                    <textarea
                                        name="features.hardness"
                                        value={formData.features.hardness}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="Describe hardness and durability..."
                                    />
                                </div>

                                {/* Cut Details */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cut Details
                                    </label>
                                    <textarea
                                        name="features.cut"
                                        value={formData.features.cut}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="Describe the cut and shape recommendations..."
                                    />
                                </div>

                                {/* Best Metal */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Best Metal
                                    </label>
                                    <textarea
                                        name="features.bestMetal"
                                        value={formData.features.bestMetal}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="Describe the best metal combinations..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Physical Properties */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                Pricing & Physical Properties
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.price ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="e.g., 50000"
                                        min="0"
                                        step="0.01"
                                    />
                                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                                </div>

                                {/* Size/Weight */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Size/Weight *
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="number"
                                            name="sizeWeight"
                                            value={formData.sizeWeight}
                                            onChange={handleInputChange}
                                            className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.sizeWeight ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="e.g., 5"
                                            min="0"
                                            step="0.01"
                                        />
                                        <select
                                            name="sizeUnit"
                                            value={formData.sizeUnit}
                                            onChange={handleInputChange}
                                            className="px-3 py-2 border-t border-r border-b border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        >
                                            <option value="carat">Carat</option>
                                            <option value="gram">Gram</option>
                                            <option value="ounce">Ounce</option>
                                        </select>
                                    </div>
                                    {errors.sizeWeight && <p className="text-red-500 text-sm mt-1">{errors.sizeWeight}</p>}
                                </div>
                            </div>

                            {/* Discount */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Discount
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="number"
                                            name="discount"
                                            value={formData.discount}
                                            onChange={handleInputChange}
                                            className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-emerald-500 border-gray-300"
                                            placeholder="e.g., 10"
                                            min="0"
                                            step="0.01"
                                        />
                                        <select
                                            name="discountType"
                                            value={formData.discountType}
                                            onChange={handleInputChange}
                                            className="px-3 py-2 border-t border-r border-b border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        >
                                            <option value="percentage">%</option>
                                            <option value="flat">₹</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Stock/Availability */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Stock Quantity
                                    </label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="e.g., 10"
                                        min="0"
                                    />
                                </div>
                            </div>

                            {/* Availability Checkbox */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="availability"
                                    checked={formData.availability}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                <label className="text-sm font-medium text-gray-700">
                                    Currently Available
                                </label>
                            </div>
                        </div>

                        {/* Images */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                Images
                            </h2>

                            {/* Image Upload Section */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload Images
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="cursor-pointer flex flex-col items-center space-y-2"
                                        >
                                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <span className="text-sm text-gray-600">
                                                Click to upload images or drag and drop
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                PNG, JPG, GIF up to 5MB each
                                            </span>
                                        </label>
                                    </div>
                                    {errors.imageUpload && (
                                        <p className="text-red-500 text-sm mt-1">{errors.imageUpload}</p>
                                    )}
                                </div>

                                {/* Uploaded Images Preview */}
                                {formData.uploadedImages.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                                            Uploaded Images ({formData.uploadedImages.length})
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                            {formData.uploadedImages.map((image) => (
                                                <div key={image.id} className="relative group">
                                                    <img
                                                        src={image.preview}
                                                        alt={image.name}
                                                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeUploadedImage(image.id)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                                    >
                                                        ×
                                                    </button>
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {image.name}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Image URLs Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Or Add Image URLs
                                </label>
                                <div className="flex space-x-2">
                                    <input
                                        type="url"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="Enter image URL"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleImageUrlAdd}
                                        className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        Add URL
                                    </button>
                                </div>

                                {/* Display added URL images */}
                                {formData.images.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <h3 className="text-sm font-medium text-gray-700">
                                            Image URLs ({formData.images.length})
                                        </h3>
                                        {formData.images.map((image, index) => (
                                            <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                                <span className="text-sm text-gray-700 truncate">{image}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeArrayItem('images', image)}
                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Total Images Summary */}
                            {(formData.images.length > 0 || formData.uploadedImages.length > 0) && (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                    <p className="text-sm text-emerald-800">
                                        Total Images: {formData.images.length + formData.uploadedImages.length}
                                        {formData.images.length > 0 && ` (${formData.images.length} URLs)`}
                                        {formData.uploadedImages.length > 0 && ` (${formData.uploadedImages.length} uploaded)`}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Certification & Origin */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                Certification & Origin
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Certification */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Certification *
                                    </label>
                                    <input
                                        type="text"
                                        name="certification"
                                        value={formData.certification}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.certification ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="e.g., Govt. Lab Certified"
                                    />
                                    {errors.certification && <p className="text-red-500 text-sm mt-1">{errors.certification}</p>}
                                </div>

                                {/* Origin */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Origin *
                                    </label>
                                    <input
                                        type="text"
                                        name="origin"
                                        value={formData.origin}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.origin ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="e.g., Sri Lanka"
                                    />
                                    {errors.origin && <p className="text-red-500 text-sm mt-1">{errors.origin}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-8 py-3 rounded-lg font-medium text-white transition-colors ${isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                                    }`}
                            >
                                {isSubmitting ? 'Adding Gem...' : 'Add Gem'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddGem;
