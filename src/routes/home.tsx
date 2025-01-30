// import WellnessRating from '@/components/WellnessRating';
import LoginPage from '@/components/pages/LoginPage';
import EmptyHomeView from '@/components/pages/home/EmptyHomeView';
import WellnessRating from '@/components/wellness-rating';
import WellnessRatingChart from '@/components/wellness-rating/WellnessRatingChart';

import { type Typology } from '@/components/typology/types';

import styles from '@/styles/HomePage.module.scss';
import completedDailyWellnessImg from '@/assets/happy_scarlet.png';

import { useEffect } from 'react';
import { useTypologies } from '@/components/typology/useTypologies';
import { useWellnessRating } from '@/components/wellness-rating/useWellnessRating.tsx';
import { Card, Text } from '@mantine/core';
import { useUserAuth } from '@/components/userAuth/UserAuthProvider';
import { useHeartsCanvas } from '@/canvas/useHeartsCanvas';

function Home() {
  const { isAuthenticated, sisuFlow } = useUserAuth();
  const { typologies, isTypologiesLoading } = useTypologies();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    sisuFlow();
  }, [isAuthenticated]);

  return (
    <>
    {!isAuthenticated ? (
      <LoginPage />
    ) : (
      <main className='page'>
        <div className={styles['home-page__body-content']}>
          {
            (!typologies || (typologies && typologies.length === 0)) ? (
              <EmptyHomeView isLoading={isTypologiesLoading} />
            ) : (
              <DailyWellnessRatingCards typologies={typologies} />
            )
          }
          <WellnessRatingChart />
        </div>
      </main>
    )}
    </>
  )
}

const DailyWellnessRatingCards = ({ typologies }: { typologies: Typology[] }) => {
  const { dailyWellnessRatings } = useWellnessRating();
  const { canvasRef, completeWellnessImageRef } = useHeartsCanvas();
  
  if (typologies.length === 0 || !dailyWellnessRatings) {
    return null;
  }

  const dailyLogKeys = Array.from(dailyWellnessRatings.keys());
  const dailyLogComplete = !typologies.some((typology) => !dailyLogKeys.includes(typology.sk));

  if (dailyLogComplete) {
    return (
      <div className={styles['daily-wellness-completed__container']}>
        <Text ta='center' fs="italic" fw={400}>
          You've tracked all your daily wellness goals today!
        </Text>
          <img
            ref={completeWellnessImageRef}
            className={styles['img-completed-wellness']}
            src={completedDailyWellnessImg}
            alt="completed daily wellness image"
          />
        <Text ta='center' fw={500}>You've made Scarlet happy!</Text>
        <canvas 
          ref={canvasRef}
        />
      </div>
    )
  }

  return (
    typologies.map((typology) => (
      !dailyWellnessRatings.has(typology.sk) ? (
        <Card padding='sm' radius='md' withBorder>
          <WellnessRating
            wellnessType={typology.typologyType}
            typologyID={typology.sk}
        />
        </Card>
      ) : null
    ))
  );
}

export default Home;
