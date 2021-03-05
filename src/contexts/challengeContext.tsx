import { createContext, useState, ReactNode, useEffect } from 'react'
import Cookies from 'js-cookie'
import challenges from '../../challenges.json'
import { LevelUpModal } from '../components/levelUpModal'

interface Challenge {
    type: 'body' | 'eye'
    description: string
    amount: number
}

interface ChallengeContextData {
    level: number
    currentExperience: number
    challengesCompleted: number
    activeChallenge: Challenge
    experienceToNextLevel: number
    completeChallenge: () => void
    levelUp: () => void
    startNewChallenge: () => void
    closeLevelModal: () => void
    resetChallenge: () => void
}

interface ChallengesProviderProps {
    children: ReactNode
    level: number
    currentExperience: number
    challengesCompleted: number
}


export const ChallengesContext = createContext({} as ChallengeContextData)

export function ChallengesProvider({ children, ...rest }: ChallengesProviderProps) {

    const [level, setLevel] = useState(rest.level ?? 1)
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0)
    const [challengesCompleted, setChallengeCompleted] = useState(rest.challengesCompleted ?? 0)

    const [activeChallenge, setActiveChallenge] = useState(null)
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false)

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

    useEffect(() => {
        Notification.requestPermission()
    }, [])

    useEffect(() => {
        Cookies.set('level', String(level))
        Cookies.set('currentExperience', String(currentExperience))
        Cookies.set('challengesCompleted', String(challengesCompleted))

    }, [level, currentExperience, challengesCompleted])

    function levelUp() {
        setLevel(level + 1);
        setIsLevelUpModalOpen(true)
    }

    function closeLevelModal() {
        setIsLevelUpModalOpen(false)
    }

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex]

        setActiveChallenge(challenge)

        new Audio('/notification.mp3').play()

        if(Notification.permission === 'granted') {
            new Notification('Novo desafio 🍬', {
                body: `Valendo ${challenge.amount} xp!`
            })
        }
    }

    function resetChallenge() {
        setActiveChallenge(null)
    }

    function completeChallenge() {
        if(!activeChallenge) {
            return
        }

        const { amount } = activeChallenge

        let finalExperience = currentExperience + amount

        if(finalExperience >= experienceToNextLevel) {
            finalExperience = finalExperience - experienceToNextLevel
            levelUp()
        }

        setCurrentExperience(finalExperience)
        setActiveChallenge(null)
        setChallengeCompleted(challengesCompleted + 1)
    }

    return (
        <ChallengesContext.Provider 
        value={{
            level, 
            currentExperience, 
            challengesCompleted, 
            levelUp, 
            resetChallenge,
            experienceToNextLevel,
            startNewChallenge,
            completeChallenge,
            closeLevelModal,
            activeChallenge
        }}>
            {children}

            {isLevelUpModalOpen && <LevelUpModal />}
        </ChallengesContext.Provider>
    )
}