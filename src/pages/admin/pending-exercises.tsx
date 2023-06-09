import { ExerciseCard } from '@/components/Exercises/ExerciseCard';
import React, { useEffect, useState } from 'react';
import AdminNavigationLayout from '@/components/Layouts/AdminNavigationLayout';
import axios from 'axios';
import AuthHeader from '@/utils/authrorizationHeader';
import { useRouter as useNavigation } from 'next/navigation';
import useText from '@/services/site-properties/parsing';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

function PendingExercises() {
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState('');
  const router = useNavigation();
  const locale = useSelector((state: RootState) => state.language.language);
  const text = {
    noExericse: useText('pages.admin.pending-exercises.no-exercises', locale),
    error: useText('pages.admin.pending-exercises.error', locale),
    accept: useText('general.accept.text', locale),
    delete: useText('general.delete.text', locale),
    exerciseType: useText(
      'pages.exercises.insert.type-of-exercises.text',
      locale
    ),
    nameExercise: useText(
      'pages.admin.pending-exercises.name-exercise.text',
      locale
    ),
  };

  useEffect(() => {
    const roles = sessionStorage.getItem('roles');
    if (!roles?.includes('Admin')) {
      router.push('/');
    }
  }, []);

  useEffect(() => {
    const getExercises = async () => {
      try {
        const result = await axios.get(
          'https://localhost:7132/Admin/getPendingExercises',
          {
            headers: {
              Authorization: AuthHeader(),
            },
          }
        );
        console.log(result);
        const data = result.data;
        setExercises(data);
      } catch (error: any) {
        setError(error);
      }
    };
    getExercises();
  }, []);

  return (
    <>
      {!error ? (
        <div className="body">
          {exercises.length > 0 ? (
            <ul className="pendingCards">
              {exercises.map((ex: any) => (
                <ExerciseCard text={text} key={ex.id} exercise={ex} />
              ))}
            </ul>
          ) : (
            <p>{text.noExericse}</p>
          )}
        </div>
      ) : (
        <h1>{text.error}</h1>
      )}
    </>
  );
}

PendingExercises.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminNavigationLayout>{page}</AdminNavigationLayout>;
};

export default PendingExercises;
