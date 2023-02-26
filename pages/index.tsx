import React, { useState, useRef, useEffect } from "react";

import { useSession } from "next-auth/react";

import { authOptions } from "./api/auth/[...nextauth]";

import { Navigation } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

import CardQuiz from "@/components/CardQuiz";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { getServerSession } from "next-auth";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

export default function Home({ quiz }: any): React.ReactElement {
  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [answerCount, setAnswerCount] = useState<number>(0);
  const [startGame, setStartGame] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const scoreRef = useRef(0);
  const router = useRouter();

  const MySwal = withReactContent(Swal);

  console.log(status);

  useEffect(() => {
    if (!session) router.push("/auth/signin");
  }, [session]);

  useEffect(() => {
    const gameoverAlert = setTimeout(() => {
      if (answerCount === quiz.length) {
        MySwal.fire({
          title: <p>Your Score : {scoreRef.current}</p>,
          icon: "success",
          showDenyButton: true,
          confirmButtonText: <p>Play Again ?</p>,
          denyButtonText: <p>Nope, I'm Tired!</p>,
        }).then((result) => {
          if (result.isConfirmed) {
            setStartGame(false);
            setQuestionNumber(0);
            setAnswerCount(0);
            scoreRef.current = 0;
          }

          if (result.isDenied) {
            MySwal.fire({
              title: <p className="text-4xl">See u next quiz, buddy !</p>,
            });
            setStartGame(false);
            setQuestionNumber(0);
            setAnswerCount(0);
            scoreRef.current = 0;
          }
        });
      }
    });
    return () => clearTimeout(gameoverAlert);
  }, [answerCount]);

  useEffect(() => {
    setTimeout(() => {
      if (session) {
        MySwal.fire({
          title: (
            <p>
              Welcome{" "}
              <span className="text-blue-500">{session.user?.name}</span>
            </p>
          ),
        });
      }
    });
  }, [session]);

  return (
    <main className="container mx-auto">
      {!startGame ? (
        <div className="mt-24 flex justify-center items-center flex-col space-y-4 max-w-2xl mx-auto">
          <h1 className="text-xl lg:text-6xl font-bold text-center">
            Brain Busters: The Ultimate Trivia Challenge
          </h1>
          <p className="text- sm lg:text-xl">Test Your Skills !</p>
          <button
            onClick={() => setStartGame((start) => !start)}
            className="text-white font-bold text-sm lg:text-2xl uppercase bg-yellow-400 py-4 px-12 rounded-full"
          >
            play
          </button>
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col mx-8 lg:mx-0">
          <header className="mb-4 flex flex-col">
            <span className="text-2xl text-white uppercase">
              question {questionNumber + 1} / {quiz.length}
            </span>
          </header>
          <div className="w-full h-full">
            <Swiper
              modules={[Navigation]}
              navigation
              slidesPerView={1}
              onSlideChange={(swiper) => {
                setQuestionNumber(swiper.activeIndex);
                console.log(swiper);
              }}
            >
              {quiz.map((question: any, id: number) => (
                <SwiperSlide key={id}>
                  <CardQuiz
                    question={question}
                    scoreRef={scoreRef}
                    setAnswerCount={setAnswerCount}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const response = await fetch("https://opentdb.com/api.php?amount=10");
  const quiz = await response.json();

  if (session) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  return {
    props: {
      quiz: quiz.results,
      session,
    },
  };
}
