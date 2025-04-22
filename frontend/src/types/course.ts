export type Course = {
    id: number;
    title: string;
    description: string;
    image: string;
    instructor: {
      name: string;
      image: string;
      bio: string;
    };
    publishDate: string;
    plateforme: string; 
  };
  