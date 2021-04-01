import { createContext, ReactNode, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import challenges from '../../challenges.json';

interface Challenge {
    type: 'body' | 'eye';
    description: string;
    amount: number;
}

interface ChallengesContextData {
    level: number;
    challengesCompleted: number;
    experienceToNextLevel: number;
    currentExperience: number;
    levelUp: ()=> void;
    startNewChallenge: ()=> void;
    activeChallenge: Challenge;
    resetChallenge: () => void;
    completeChallenge: () => void;
}


interface ChallengesProviderProps {
    children: ReactNode;
}


export const ChallengesContext = createContext({} as ChallengesContextData);


export function ChallengesProvider({ children }: ChallengesProviderProps){
    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrentExperience] = useState(0);
    const [challengesCompleted, setChallengesCompleted ] = useState(0);

    const [activeChallenge, setActiveChallenge] = useState(null);


    const experienceToNextLevel = Math.pow((level + 1) * 4, 2)
    // calculo usado para jogos RPG para calcular a experiencia do usuario.

    useEffect(() => {
        Notification.requestPermission();
    }, [])

    useEffect(() => {
        Cookies.set('level', String(level));
        Cookies.set('currentExperience', String(level));
        Cookies.set('challengesCompleted', String(level));
    }, [level, currentExperience, challengesCompleted]);

  
    function levelUp() {
    
      setLevel(level + 1)
    
    }
  
    function startNewChallenge(){
        const radomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[radomChallengeIndex];

        setActiveChallenge(challenge);

        new Audio('/notification.mp3').play();

        if (Notification.permission === 'granted') {
            new Notification('Novo Desafio 🎉', {
                body: `Valendo ${challenge.amount}xp!`
            })
        }

    }

    function resetChallenge(){
        setActiveChallenge(null);
    }

    function completeChallenge() {
        if(!activeChallenge) {
            return;
        }

        const {amount} = activeChallenge;

        let finalExperience = currentExperience + amount;

        if (finalExperience >= experienceToNextLevel) {
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);

    }

    return (
      <ChallengesContext.Provider 
        value={{
             level,
             levelUp,
             currentExperience,
             experienceToNextLevel,
             challengesCompleted,
             startNewChallenge,
             activeChallenge,
             resetChallenge,
             completeChallenge,
             }}>

          {children}
      </ChallengesContext.Provider>
    )
}