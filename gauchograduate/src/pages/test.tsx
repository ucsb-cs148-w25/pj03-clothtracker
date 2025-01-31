'use client';

import { useState, useEffect } from "react";
import CourseCatalog from "../app/components/CourseCatalog";
import FourYearPlan from "../app/components/four-year-plan";
import Navbar from "../app/components/Navbar";
import { Course, ScheduleType, YearType, Term } from "../app/components/coursetypes";

// Function to fetch courses from API
async function fetchAndSetCourses(setCourses: (courses: Course[]) => void) {
    try {
        const response = await fetch("https://thingproxy.freeboard.io/fetch/https://gauchograduate.vercel.app/api/course/query?quarter=20241");

        if (!response.ok) {
            throw new Error(`Failed to fetch courses. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging: Check API response

        if (!data || !data.courses || !Array.isArray(data.courses)) {
            console.error("Unexpected API structure", data);
            return;
        }

        // Transform API response into expected Course structure
        const formattedCourses: Course[] = data.courses.map((course: any) => ({
            course_id: course.course_id.trim(),  
            title: course.title,
            description: course.description,
            subjectArea: course.subject_area, 
            department: course.subject_area, // Mapping `subject_area` to `department`
            units: course.units,
            generalEd: course.general_ed || [],  
            prerequisites: course.prerequisites || [],
            unlocks: course.unlocks || [],
            term: [] // API does not provide term data, so set it as an empty array
        }));

        console.log("Formatted Courses:", formattedCourses);

        setCourses(formattedCourses);
    } catch (error) {
        console.error("Error fetching courses:", error);
    }
}

export default function TestPage() {
    const [courses, setCourses] = useState<Course[]>([]);

    // Fetch courses when component mounts
    useEffect(() => {
        fetchAndSetCourses(setCourses);
    }, []);

    const defaultSchedule: ScheduleType = {
        "Year 1": { Fall: [], Winter: [], Spring: [], Summer: [] },
        "Year 2": { Fall: [], Winter: [], Spring: [], Summer: [] },
        "Year 3": { Fall: [], Winter: [], Spring: [], Summer: [] },
        "Year 4": { Fall: [], Winter: [], Spring: [], Summer: [] },
    };

    const [studentSchedule, setStudentSchedule] = useState<ScheduleType>(defaultSchedule);
    const [selectedYear, setSelectedYear] = useState<YearType>("Year 1");

    const addCourse = (course: Course, term: Term) => {
        setStudentSchedule((prevSchedule) => ({
            ...prevSchedule,
            [selectedYear]: {
              ...prevSchedule[selectedYear],
              [term]: [...prevSchedule[selectedYear][term], course]
            }
        }));
    };

    const removeCourse = (course: Course, term: Term) => {
        setStudentSchedule((prevSchedule) => ({
            ...prevSchedule,
            [selectedYear]: {
                ...prevSchedule[selectedYear],
                [term]: prevSchedule[selectedYear][term].filter((c) => c.course_id !== course.course_id),
            },
        }));
    };

    return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {/* Course Catalog */}
        <CourseCatalog courses={courses} />

        {/* 4-year calendar */}
        <div className="w-2/4 bg-white p-4 rounded-md shadow">
          <FourYearPlan 
          selectedYear={selectedYear} 
          setSelectedYear={setSelectedYear} 
          studentSchedule={studentSchedule} 
          addCourse={addCourse}
          removeCourse={removeCourse}
          />
        </div>

        {/* Graduation Progress */}
        <div className="w-1/4 bg-[var(--off-white)] p-4">
          <h2 className="text-xl font-semibold">Progress Tracker</h2>
        </div>
      </div>
    </div>
  );
}
