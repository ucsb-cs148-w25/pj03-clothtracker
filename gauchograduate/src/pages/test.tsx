'use client';

import { useState, useEffect } from "react";
import CourseCatalog from "../app/components/CourseCatalog";
import FourYearPlan from "../app/components/four-year-plan";
import Navbar from "../app/components/Navbar";
import { Course, ScheduleType, YearType, Term } from "../app/components/coursetypes";

const termToQuarter: { [key in Term]: string } = {
  Fall: "20241",
  Winter: "20242",
  Spring: "20243",
  Summer: "20244",
};

async function fetchAndSetCourses(quarter: string, setCourses: (courses: Course[]) => void) {
  try {
    const response = await fetch(`https://thingproxy.freeboard.io/fetch/https://gauchograduate.vercel.app/api/course/query?quarter=${quarter}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch courses. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`API Response for quarter ${quarter}:`, data);

    if (!data || !data.courses || !Array.isArray(data.courses)) {
      console.error("Unexpected API structure", data);
      return;
    }

    const formattedCourses: Course[] = data.courses.map((course: any) => ({
      course_id: course.course_id.trim(),
      title: course.title,
      description: course.description,
      subjectArea: course.subject_area,
      department: course.subject_area,
      units: course.units,
      generalEd: course.general_ed || [],
      prerequisites: course.prerequisites || [],
      unlocks: course.unlocks || [],
      term: []
    }));

    const sortedCourses = formattedCourses.sort((a, b) => a.course_id.localeCompare(b.course_id));

    console.log(`Formatted and Sorted Courses for quarter ${quarter}:`, sortedCourses);

    setCourses(sortedCourses);
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
}

export default function TestPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<Term>("Fall"); // Default to Fall

  useEffect(() => {
    console.log(`Fetching courses for selected term: ${selectedTerm}`);
    fetchAndSetCourses(termToQuarter[selectedTerm], setCourses);
  }, [selectedTerm]);

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
            <CourseCatalog courses={courses} selectedTerm={selectedTerm} setSelectedTerm={setSelectedTerm} />

            {/* 4 year plan */}
            <div className="w-2/4 bg-white p-4 rounded-md shadow">
                <FourYearPlan 
                  selectedYear={selectedYear} 
                  setSelectedYear={setSelectedYear} 
                  studentSchedule={studentSchedule} 
                  addCourse={addCourse}
                  removeCourse={removeCourse}
                />
            </div>

            {/* Graduation Progess */}
            <div className="w-1/4 bg-[var(--off-white)] p-4">
                <h2 className="text-xl font-semibold">Progress Tracker</h2>
            </div>
        </div>
    </div>
  );
}

