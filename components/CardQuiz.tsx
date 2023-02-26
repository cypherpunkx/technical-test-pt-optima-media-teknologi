import React, { useState, useCallback } from "react";
import { shuffle } from "lodash";
import { Difficulty } from "@/helpers/helpers";
import { QuestionProps } from "@/interfaces/quiz";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const CardQuiz = ({
  question,
  scoreRef,
  setAnswerCount,
}: {
  question: QuestionProps;
  scoreRef: any;
  setAnswerCount: React.Dispatch<React.SetStateAction<number>>;
}): React.ReactElement => {
  const [answer, setAnswer] = useState<string>("");
  const [isAnswer, setIsAnswer] = useState<boolean>(false);

  const MySwal = withReactContent(Swal);

  const checkAnswer = useCallback(
    (answer: string) => {
      return (correntAnswer: string) => {
        MySwal.fire({
          title: <p>Are you sure with your answer ?</p>,
          showDenyButton: true,
          showCloseButton: false,
          confirmButtonText: <span>I'm Right</span>,
          denyButtonText: <span>I doubt</span>,
        }).then((result) => {
          if (result.isConfirmed) {
            if (answer === correntAnswer) {
              scoreRef.current = scoreRef.current + 10;
            }
            setAnswerCount((count) => count + 1);
            setAnswer(answer);
            setIsAnswer(true);
          }
        });
      };
    },
    [isAnswer]
  );

  return (
    <div className="bg-white max-w-4xl mx-auto p-12 rounded-md text-center">
      <div className="space-y-4">
        <h6 className="text-2xl lg:text-4xl font-bold mb-5">
          {question.category}
        </h6>
        <span
          className={`${
            (question.difficulty.toUpperCase() === Difficulty.Hard &&
              "bg-red-500") ||
            (question.difficulty.toUpperCase() === Difficulty.Medium &&
              "bg-yellow-400") ||
            (question.difficulty.toUpperCase() === Difficulty.Easy &&
              "bg-green-500")
          } py-2 px-4 rounded-full text-white font-bold uppercase text-sm`}
        >
          {question.difficulty}
        </span>
        <p className="text-xl py-3 lg:px-20">{question.question}</p>
        {answer && (
          <p className="text-center font-semibold flex flex-col items-center">
            Your Answer{" "}
            <span className="text-sm lg:text-base font-semibold bg-blue-500 py-1 px-2 rounded-full text-white max-w-max">
              {answer}
            </span>
          </p>
        )}
        <div className="flex gap-4 flex-col pt-4">
          {shuffle(
            [...question.incorrect_answers, question.correct_answer].map(
              (answer: string, i: number) => (
                <button
                  key={i}
                  className="bg-yellow-400 py-2 px-4 rounded-full disabled:bg-yellow-400/30"
                  onClick={() => checkAnswer(answer)(question.correct_answer)}
                  disabled={isAnswer ? true : false}
                >
                  {answer}
                </button>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CardQuiz;
