'use client';

import React, { useState } from 'react';
import { Course, Term } from "./coursetypes";

interface CourseCatalogProps {
    courses: Course[];
    selectedTerm: Term;
    setSelectedTerm: (term: Term) => void;
}

export default function CourseCatalog({ courses, selectedTerm, setSelectedTerm }: CourseCatalogProps) {

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const departments = [...new Set(courses.map((course) => course.department))];

    const termOptions: Term[] = ["Fall", "Winter", "Spring", "Summer"];

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedDepartment === '' || course.department === selectedDepartment)
    );

    return (
        <div className="w-1/4 bg-[var(--off-white)] p-4">
            <h2 className="text-xl font-semibold mb-4">Course Catalog</h2>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search courses..."
                className="w-full text-sm p-2 mb-4 border border-gray-300 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="flex flex-row space-x-2">
                {/* Department Selector */}
                <select
                    className="p-2 border border-gray-300 rounded-lg mb-4"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                    <option value="">Department</option>
                    {departments.map((dept) => (
                        <option key={dept} value={dept}>
                            {dept}
                        </option>
                    ))}
                </select>

                {/* Fixed Term Selector - Updates Parent State */}
                <select
                    className="p-2 border border-gray-300 rounded-lg mb-4"
                    value={selectedTerm}
                    onChange={(e) => setSelectedTerm(e.target.value as Term)}
                >
                    {termOptions.map((term) => (
                        <option key={term} value={term}>
                            {term}
                        </option>
                    ))}
                </select>
            </div>

            {/* Course Cards */}
            <div className="space-y-4">
                {filteredCourses.map((course) => (
                    <div
                        key={course.course_id}
                        className="p-4 border border-gray-300 rounded-xl bg-white flex flex-col gap-5"
                        draggable={true}
                        onDragStart={(e) => {
                            e.dataTransfer.setData("application/json", JSON.stringify(course));
                        }}
                    >
                        <div>
                            <h3 className="text-lg font-bold">{course.course_id}</h3>
                            <p className="text-sm">{course.title}</p>
                        </div>

                        <div className="flex gap-10 justify-between items-center">
                            <p className="text-sm text-gray-500">{course.units} units</p>
                            <div className="p-1.5 border border-[var(--pale-pink)] rounded-lg bg-[var(--pale-pink)]">
                                <p className="text-xs text-gray-500">{course.generalEd}</p>
                            </div>
                        </div>
                    </div>
                ))}
                {/* If no courses match the filter */}
                {filteredCourses.length === 0 && (
                    <p className="text-sm text-gray-500">No courses found.</p>
                )}
            </div>
        </div>
    );
}
