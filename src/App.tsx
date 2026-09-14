import { SiteNav } from './components/SiteNav/SiteNav.tsx';
import { Hero } from './components/Hero/Hero.tsx';
import { Confidants } from './components/Confidants/Confidants.tsx';
import { Mementos } from './components/Mementos/Mementos.tsx';
import { VelvetRoom } from './components/VelvetRoom/VelvetRoom.tsx';
import { Contact } from './components/Contact/Contact.tsx';
import styles from './App.module.css';

export const App = () => (
  <>
    <SiteNav />
    <div className={styles.page}>
      <div className={styles.dots} aria-hidden="true" />
      <Hero />
      <main className="wrap">
        <Confidants />
        <Mementos />
        <VelvetRoom />
      </main>
      <Contact />
    </div>
  </>
);
