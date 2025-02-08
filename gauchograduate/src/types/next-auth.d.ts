import "next-auth"

export interface UserCourse {
  quarter: string;
  id: string;
  grade?: string;
}

export interface UserCourses {
  firstQuarter: string;
  courses: UserCourse[];
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: DefaultSession["user"] & {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      majorId: number | null;
      courses: UserCourses;
    }
  }
}
