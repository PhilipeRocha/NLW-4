import { useContext } from 'react'
import { ChallengesContext } from '../contexts/challengeContext'
import styles from '../styles/components/Perfil.module.css'

export function Profile() {
    const { level } = useContext(ChallengesContext)
    return (
        <div className={styles.profileContainer}>
            <img src="https://1.bp.blogspot.com/-4JW4aXdifz4/XP6B1tWDXxI/AAAAAAABUMI/SZxZr5ugAj00hGqm8kQ-U_1VBrSkYwaLACLcBGAs/s1600/morde.png" alt="´perfil"/>
            <div>
                <strong>Philipe Rocha</strong>
                <p>
                    <img src="icons/level.svg" alt="Level"/>
                    Level {level}
                </p>
            </div>
        </div>
    )
}