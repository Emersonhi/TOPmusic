'use client';
import { useState, useMemo, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BookOpen, Search } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';

interface Term { term: string; def: string; }
interface Section { letter: string; terms: Term[]; }

const GLOSSARY: Section[] = [
  { letter: 'A', terms: [
    { term: 'absolute music', def: 'Instrumental music with no intended story (non-programmatic music).' },
    { term: 'a cappella', def: 'Choral music with no instrumental accompaniment.' },
    { term: 'accelerando', def: 'Gradually speeding up the speed of the rhythmic beat.' },
    { term: 'accent', def: 'Momentarily emphasizing a note with a dynamic attack.' },
    { term: 'accessible', def: 'Music that is easy to listen to and understand.' },
    { term: 'adagio', def: 'A slow tempo.' },
    { term: 'alla breve / cut time', def: "A meter with two half-note beats per measure. It's often symbolized by the cut-time symbol." },
    { term: 'allegro', def: 'A fast tempo; music should be played cheerfully / upbeat brisk.' },
    { term: 'alto', def: 'A low-ranged female voice; the second highest instrumental range. Instrument examples: alto flute, viola, French horn, natural horn, alto horn, alto saxophone, English horn.' },
    { term: 'andante', def: 'Moderate tempo (a walking speed; "Andare" means to walk).' },
    { term: 'aria', def: 'A beautiful manner of solo singing, accompanied by orchestra, with a steady metrical beat.' },
    { term: 'articulation marks', def: 'Symbols indicating how notes should be played. Normal: 100% | Staccato (·): 50% | Accent (>): 75% | Marcato (^): 50% with more weight on the front | Tenuto (—): 100%.' },
    { term: 'art-music', def: 'A general term used to describe the "formal concert music" traditions of the West, as opposed to "popular" and "commercial music" styles.' },
    { term: 'art song', def: 'A musical setting of artistic poetry for solo voice accompanied by piano (or orchestra).' },
    { term: 'atonal', def: 'Music that is written and performed without regard to any specific key.' },
    { term: 'atonality', def: 'Modern harmony that intentionally avoids a tonal center (has no apparent home key).' },
    { term: 'augmentation', def: 'Lengthening the rhythmic values of a fugal subject.' },
    { term: 'avant-garde', def: '("At the forefront") A French term that describes highly experimental modern musical styles.' },
  ]},
  { letter: 'B', terms: [
    { term: 'ballad', def: 'A work in dance form imitative of a folk song, with a narrative structure.' },
    { term: 'ballet', def: 'A programmatic theatrical work for dancers and orchestra.' },
    { term: 'bar', def: 'A common term for a musical measure.' },
    { term: 'barcarolle', def: 'A boating song, generally describing the songs sung by gondoliers in Venice. Chopin, Mendelssohn, Fauré and Offenbach all wrote works imitating the form.' },
    { term: 'baritone', def: 'A moderately low male voice; in range between a tenor and a bass. Instrument examples: cello, baritone horn, bass clarinet, bassoon, baritone saxophone.' },
    { term: 'Baroque Era', def: 'c1600–1750; a musical period of extremely ornate and elaborate approaches to the arts. This era saw the rise of instrumental music, the invention of the modern violin family and the creation of the first orchestras (Vivaldi, Handel, JS Bach).' },
    { term: 'bass', def: 'The lowest male voice. Instrument examples: double bass, contrabassoon, tuba, sousaphone, bass saxophone.' },
    { term: 'bass drum', def: 'The lowest-sounding non-pitched percussion instrument.' },
    { term: 'basso continuo', def: "The back-up ensemble of the Baroque Era, usually comprised of a keyboard instrument (harpsichord or organ) and a melodic stringed bass instrument (viol da gamba or cello)." },
    { term: 'bassoon', def: 'The lowest-sounding regular instrument of the woodwind family (a double-reed instrument).' },
    { term: 'beat', def: 'A musical pulse.' },
    { term: 'bebop', def: 'A complex, highly-improvisatory style of jazz promoted by Charlie Parker in the 1940s–50s.' },
    { term: 'bells', def: 'See glockenspiel.' },
    { term: 'berceuse', def: 'A lullaby; generally slow and undulating.' },
    { term: 'Big Band jazz', def: 'See Swing.' },
    { term: 'binary form', def: 'A form comprised of two distinctly opposing sections ("A" vs. "B").' },
    { term: 'bitonality', def: 'Modern music sounding in two different keys simultaneously.' },
    { term: 'Blues', def: 'A melancholy style of Afro-American secular music, based on a simple musical/poetic form. "Delta" blues began in the early 1900s; "Classic" blues in the late 1920s; "Rhythm and Blues" in the 1940s.' },
    { term: 'bolero', def: 'A Spanish dance.' },
    { term: 'brass instrument', def: 'A powerful metallic instrument with a mouthpiece and tubing that must be blown into by the player, such as trumpet, trombone, French horn, tuba, baritone, bugle.' },
  ]},
  { letter: 'C', terms: [
    { term: 'cadence', def: 'A melodic or harmonic punctuation mark at the end of a phrase, major section or entire work.' },
    { term: 'cadenza', def: 'An unaccompanied section of virtuosic display played by a soloist in a concerto.' },
    { term: 'call and response', def: 'A traditional African process in which a leader\'s phrase ("call") is repeatedly answered by a chorus. This process became an important aspect of many Afro-American styles.' },
    { term: 'canon', def: 'A type of strict imitation created by strict echoing between a melodic "leader" and subsequent "follower(s)".' },
    { term: 'cantabile', def: 'A style of singing which is characterized by the easy and flowing tone of the composition.' },
    { term: 'cantata', def: 'A composition in several movements, written for chorus, soloist(s) and orchestra; traditionally, these are religious works.' },
    { term: 'capriccio', def: 'A quick, improvisational, spirited piece of music.' },
    { term: 'carol', def: 'A song or hymn celebrating Christmas.' },
    { term: 'cavatina', def: 'A short and simple melody performed by a soloist that is part of a larger piece.' },
    { term: 'cello', def: 'The tenor-ranged instrument of the modern string family (an abbreviation for violoncello).' },
    { term: 'chamber music', def: 'Music performed by a small group of players (2 to 10, one player per part). Each part bears the same importance.' },
    { term: 'chance music', def: 'A modern manner of composition in which some or all of the work is left to chance.' },
    { term: 'chanson', def: 'A French song, from the middle ages to the 20th century.' },
    { term: 'chant', def: 'A monophonic melody sung in a free rhythm (such as "Gregorian" chant of the Roman Catholic Church).' },
    { term: 'character piece', def: 'A 1-movement programmatic work for a solo pianist.' },
    { term: 'chimes', def: 'A percussion instrument comprised of several tube-shaped bells struck by a leather hammer.' },
    { term: 'choir', def: 'A group of singers in a chorus.' },
    { term: 'chorale', def: '1) A Lutheran liturgical melody; 2) a 4-part hymn-like chorale harmonization; 3) a hymn sung by the choir and congregation often in unison.' },
    { term: 'chord', def: 'A harmonic combination that has three or more pitches sounding simultaneously; see also partial chord.' },
    { term: 'chord progression', def: 'A string of chords played in succession.' },
    { term: 'chorus', def: '1) A fairly large choral group; 2) in Jazz, a single statement of the main harmonic/melody pattern.' },
    { term: 'chromatic', def: 'Notes which do not belong to the diatonic scale. In the scale of C major (the white notes on the piano), the black keys (sharps and flats) are the chromatic notes.' },
    { term: 'chromatic scale', def: 'Includes all twelve notes of an octave.' },
    { term: 'chromaticism', def: '1) Harmonic or melodic movement by half-step intervals; 2) harmony that uses pitches beyond the central key of a work.' },
    { term: 'clarinet', def: 'The tenor-ranged instrument of the woodwind family (a single-reed instrument).' },
    { term: 'Classical Era', def: 'c1750–1820; a politically turbulent era focused on structural unity, clarity and balance (Haydn, Mozart, Beethoven). The music was spare and emotionally reserved, especially when compared to Romantic and Baroque music.' },
    { term: 'Classicism', def: 'The period of music history which dates from the mid 1800s and lasted about sixty years. There was a strong regard for order and balance.' },
    { term: 'clef', def: 'In sheet music, a symbol at the beginning of the staff defining the pitch of the notes found in that particular staff. Examples: alto, treble, bass.' },
    { term: 'coda', def: '(Means "tail" in Italian) A concluding section appended to the end of a work.' },
    { term: 'collegium musicum', def: 'A university ensemble dedicated to the performance of early music (pre-1750).' },
    { term: 'col legno', def: 'An instruction for string players that indicates the wooden side of the bow should be used to hit the strings.' },
    { term: 'coloratura', def: 'A type of decoration, usually in singing, that is ornate and richly ornamented.' },
    { term: 'computer music', def: 'Music in which the composition and/or performance is controlled by a computer.' },
    { term: 'concert band', def: 'A large (non-marching) ensemble of woodwind, brass and percussion instruments.' },
    { term: 'concert master', def: 'The first violin in an orchestra.' },
    { term: 'concerto', def: 'The general term for a multi-movement work for soloist(s) and orchestra (see "solo concerto" and "concerto grosso").' },
    { term: 'concerto grosso', def: 'A 3-movement work for a small group of soloists and orchestra.' },
    { term: 'conductor', def: 'The leader of a performing group of musicians. The conductor indicates the tempo, phrasing, dynamics, and style by gestures and facial expressions.' },
    { term: 'consonance', def: 'Pleasant-sounding harmony.' },
    { term: 'contralto', def: 'Lowest female singing voice.' },
    { term: 'contrabassoon', def: 'The lowest-sounding double-reed instrument of the woodwind family.' },
    { term: 'cool jazz', def: 'A relaxed style of modern jazz, promoted in the 1950s/60s by Brubeck etc.' },
    { term: 'cornet', def: 'A mellow-sounding member of the trumpet family.' },
    { term: 'countermelody', def: 'A secondary melodic idea that accompanies and opposes a main thematic idea.' },
    { term: 'counterpoint', def: 'A complex polyphonic texture combining two or more independent melodies.' },
    { term: 'countertenor', def: 'The vocal range of a male alto. Close in range to a female soprano.' },
    { term: 'courante', def: 'A piece of music written in triple time. Also an old French dance.' },
    { term: 'crescendo', def: 'Gradually getting louder.' },
    { term: 'cut time', def: 'See alla breve.' },
    { term: 'cymbals', def: 'Percussion instrument usually consisting of two circular brass plates struck together as a pair.' },
  ]},
  { letter: 'D', terms: [
    { term: 'da capo', def: '(Italian "to the head") A written indication telling a performer to go back to the start of a piece and play either to the end (Da capo al fine) or to the sign (Da capo al segno).' },
    { term: 'deceptive cadence', def: 'A chord progression that seems to lead to resolving itself on the final chord, but does not.' },
    { term: 'decrescendo', def: 'Gradually getting quieter (see diminuendo).' },
    { term: 'development', def: '1) The central dramatic section of a sonata form that moves harmonically through many keys; 2) the process of expanding or manipulating a musical idea.' },
    { term: 'diatonic', def: 'A melody or harmony based on one of the seven-tone major or minor Western scales.' },
    { term: 'Dies Irae', def: "A chant from the Requiem Mass dealing with God's wrath on the day of judgment." },
    { term: 'diminuendo', def: 'Gradually getting quieter (see decrescendo).' },
    { term: 'diminution', def: 'To shorten the note values of a theme (usually to render it twice as fast).' },
    { term: 'dissonance', def: 'Harsh, discordant, and lack of harmony. Also a chord that sounds incomplete until it resolves itself on a harmonious chord.' },
    { term: 'disjunct', def: 'A melody that is not smooth in contour (has many leaps).' },
    { term: 'Doctrine of Affections', def: 'The Baroque methodology for evoking a specific emotion through music and text.' },
    { term: 'dotted note', def: "A written note with a dot to the right of it (the dot adds half the rhythmic duration to the note's original value)." },
    { term: 'double bass', def: 'The lowest-sounding instrument of the modern string family.' },
    { term: 'downbeat', def: 'The first beat of a musical measure (usually accented more strongly than other beats).' },
    { term: 'drone', def: 'Dull, monotonous tone such as a humming or buzzing sound. Also a bass note held under a melody.' },
    { term: 'drum kit / drum set', def: 'A collection of drums and percussion instruments set up on stands to be played by one person. Typically made up of a snare drum, a bass drum, one or more toms, a hi-hat, and one or more cymbals.' },
    { term: 'duet', def: 'A piece of music written for two vocalists or instrumentalists.' },
    { term: 'duple meter', def: 'A basic metrical pattern having two beats per measure.' },
    { term: 'dynamics', def: 'The musical element of relative musical loudness or quietness. Also the symbols in sheet music indicating volume.' },
  ]},
  { letter: 'E', terms: [
    { term: 'electric instrument', def: 'An instrument whose sound is produced or modified by an electro-magnetic pick-up.' },
    { term: 'electronic instrument', def: 'An instrument whose sound is produced or modified by electronic means.' },
    { term: 'elegy', def: 'An instrumental lament with praise for the dead.' },
    { term: 'encore', def: "A piece of music played at the end of a recital responding to the audience's enthusiastic reaction to the performance, shown by continuous applause." },
    { term: 'energico', def: 'A symbol in sheet music; a direction to play energetically.' },
    { term: 'English horn', def: 'A tenor oboe; a richly nasal-sounding double-reed woodwind instrument.' },
    { term: 'enharmonic interval', def: 'Two notes that differ in name only. The notes occupy the same position. For example: C sharp and D flat.' },
    { term: 'ensemble', def: 'A group of musical performers.' },
    { term: 'episode', def: 'An intermediary (contrasting) section of a Baroque fugue or Classic rondo form.' },
    { term: 'equal temperament', def: 'The standard modern tuning system in which the octave is divided into twelve equal "half-steps".' },
    { term: 'espressivo', def: 'A direction to play expressively.' },
    { term: 'étude', def: '(French) A "study" piece, designed to help a performer master a particular technique; often performed for artistic interest. Some of the hardest instrumental works are large scale etudes by composers such as Chopin and Liszt.' },
    { term: 'euphonium', def: 'A brass instrument similar to a baritone horn.' },
    { term: 'exposition', def: '1) The opening section of a fugue; 2) the opening section of a Classic sonata form (in which the two opposing key centers are exposed to the listener for the first time).' },
    { term: 'expressionism', def: 'An ultra-shocking, highly-dissonant modern style of music.' },
  ]},
  { letter: 'F', terms: [
    { term: 'falsetto', def: 'A vocal technique that allows a male to sing in a much higher, lighter register (by vibrating only half of the vocal cord).' },
    { term: 'fermata', def: 'To hold a tone or rest held beyond the written value at the discretion of the performer.' },
    { term: 'fifth', def: 'The interval between two notes. Three whole tones and one semitone make up the distance between the two notes.' },
    { term: 'film music', def: 'Music that serves either as background or foreground material for a movie.' },
    { term: 'finale', def: 'Movement or passage that concludes the musical composition.' },
    { term: 'flat', def: 'Indicated by a stylised ♭ sign, shows that the note before which it is placed should be lowered by a semitone. Flat can also mean that a note is out of tune, sounding lower than it should.' },
    { term: 'flat sign', def: 'A musical symbol that lowers the pitch one half-step.' },
    { term: 'flute', def: 'A metal tubular instrument that is the soprano instrument of the standard woodwind family.' },
    { term: 'form', def: 'The elemental category describing the shape/design of a musical work or movement.' },
    { term: 'forte', def: "A dynamic instruction meaning the music should be played loudly. Appears as: 'f' loud; 'ff' fortissimo, very loud; or 'fff' extremely loud." },
    { term: 'fortepiano', def: 'An early prototype of the modern piano (designed to play both "loud" and "quiet").' },
    { term: 'fortissimo', def: 'A very loud dynamic marking.' },
    { term: 'fourth', def: 'The interval between two notes. Two whole tones and one semitone make up the distance between the two notes.' },
    { term: 'French horn', def: 'A valved brass instrument of medium/medium-low range (alto to bass).' },
    { term: 'fugue', def: 'A complex contrapuntal manipulation of a musical subject. A composition written for three to six voices. Beginning with the exposition, each voice enters at different times, creating counterpoint with one another.' },
    { term: 'fusion', def: 'A blending of jazz and rock styles.' },
  ]},
  { letter: 'G', terms: [
    { term: 'galliard', def: 'Music written for a lively French dance for two performers written in triple time.' },
    { term: 'gamelan', def: 'An Indonesian musical ensemble comprised primarily of percussion instruments.' },
    { term: 'gavotte', def: 'A 17th century dance written in quadruple time, always beginning on the third beat of the measure.' },
    { term: 'genre', def: 'A category of musical composition (the specific classification of a musical work).' },
    { term: 'gigue', def: 'A lively dance form from the Baroque period, from the English jig.' },
    { term: 'giocoso', def: 'Meaning the piece should be played in a cheerful or playful way.' },
    { term: 'glee', def: 'Vocal composition written for three or more solo parts, usually without instrumental accompaniment.' },
    { term: 'glissando', def: 'A rapid slide between two distant pitches.' },
    { term: 'glockenspiel', def: 'A pitched-percussion instrument comprised of metal bars in a frame struck by a mallet. Also known as bells.' },
    { term: 'gong', def: '(Also called "tam-tam") A non-pitched percussion instrument made of a large metal plate struck with a mallet.' },
    { term: 'grandioso', def: 'Word to indicate that the movement or entire composition is to be played grandly.' },
    { term: 'grave', def: 'A slow, solemn tempo.' },
    { term: 'grazioso', def: 'Word to indicate the movement or entire composition is to be played gracefully.' },
    { term: 'Gregorian chant', def: 'Monophonic, non-metered melodies set to Latin sacred texts. Singing or chanting in unison without strict rhythm. Collected during the Reign of Pope Gregory VIII for psalms and other parts of the church service.' },
    { term: 'guitar', def: 'A six-stringed fretted instrument.' },
  ]},
  { letter: 'H', terms: [
    { term: 'habañera', def: 'An exotic Cuban dance in duple meter.' },
    { term: 'half step', def: 'The smallest interval in the Western system of equal temperament.' },
    { term: 'harmony', def: 'The elemental category describing vertical combinations of pitches; pleasing combination of two or three tones played together.' },
    { term: 'harp', def: 'A plucked instrument having strings stretched on a triangular frame.' },
    { term: 'harpsichord', def: 'An ancient keyboard instrument whose sound is produced by a system of levered picks that pluck its metal strings (common in the Renaissance and Baroque eras).' },
    { term: 'home key', def: 'See tonic key.' },
    { term: 'homophonic texture', def: '1) A main melody supported by chords; 2) a texture in which voices on different pitches sing the same words simultaneously.' },
    { term: 'horn', def: 'See French horn.' },
    { term: 'hot jazz', def: 'A "Dixieland" style of jazz with a fast tempo promoted by Louis Armstrong.' },
    { term: 'humoresque', def: 'A piece of music with a humorous feel.' },
    { term: 'hymn', def: 'A song of praise and glorification. Most often to honor God.' },
  ]},
  { letter: 'I', terms: [
    { term: 'idée fixe', def: 'A transformable melody that recurs in every movement of a multi-movement work.' },
    { term: 'imitation', def: 'A polyphonic texture in which material is presented then echoed from voice to voice.' },
    { term: 'Impressionism', def: 'A modern French musical style based on blurred effects, beautiful tone colors and fluid rhythms (promoted by Debussy around the turn of the 1900s).' },
    { term: 'impromptu', def: 'A short piano piece, often improvisational and intimate in character.' },
    { term: 'improvisation', def: '"On-the-spot" creation of music (while it is being performed).' },
    { term: 'incidental music', def: 'Music performed during a theatrical play.' },
    { term: 'instrumentation', def: 'The combination of instruments that a composition is written for.' },
    { term: 'interlude', def: 'Piece of instrumental music played between scenes in a play or opera.' },
    { term: 'intermezzo', def: 'Short movement or interlude connecting the main parts of the composition.' },
    { term: 'interpretation', def: 'The expression the performer brings when playing his instrument.' },
    { term: 'interval', def: 'The measured distance between two musical pitches.' },
    { term: 'intonation', def: 'The manner in which tones are produced with regard to pitch.' },
    { term: 'introduction', def: 'The opening section of a piece of music or movement.' },
    { term: 'inversion', def: 'A variation technique in which the intervals of a melody are turned upside down.' },
  ]},
  { letter: 'J', terms: [
    { term: 'jazz', def: 'A style of American modern popular music combining African and Western musical traits.' },
    { term: 'jazz band', def: 'An instrumental ensemble comprised of woodwinds (saxophones and clarinets), brasses (trumpets and trombones) and rhythm section (piano/guitar, bass and drum set).' },
    { term: 'jig', def: 'A lively English dance, usually placed at the end of a Baroque suite.' },
  ]},
  { letter: 'K', terms: [
    { term: 'kettledrums', def: 'See timpani.' },
    { term: 'key', def: 'The central note, chord or scale of a musical composition or movement.' },
    { term: 'key signature', def: 'A series of sharps or flats written on a musical staff to indicate the key of a composition.' },
    { term: 'keyboard instrument', def: 'Any instrument whose sound is initiated by pressing a series of keys with the fingers; piano, harpsichord, organ, synthesizer are the most common types.' },
    { term: 'Klangfarbenmelodie', def: 'The technique of altering the tone color of a single note or musical line by changing from one instrument to another in the middle of a note or line.' },
    { term: 'koto', def: 'A Japanese plucked instrument with 13 strings and moveable bridges.' },
  ]},
  { letter: 'L', terms: [
    { term: 'largo', def: 'A very slow, broad tempo.' },
    { term: 'leading note', def: 'The seventh note of the scale where there is a strong desire to resolve on the tonic.' },
    { term: 'legato', def: 'A smooth, connected manner of performing a sequence of notes.' },
    { term: 'leitmotif', def: 'A short musical "signature tune" associated with a person or concept in an opera.' },
    { term: 'lento', def: 'Tempo instruction meaning the music is slow.' },
    { term: 'libretto', def: 'The sung/spoken text of an opera.' },
    { term: 'Lied', def: 'A German-texted art song (usually for one voice with piano accompaniment); plural = Lieder.' },
    { term: 'ligature', def: 'Curved line connecting notes to be sung or played as a phrase.' },
    { term: 'lute', def: 'An ancient pear-shaped plucked instrument widely used in the Renaissance and Baroque eras.' },
  ]},
  { letter: 'M', terms: [
    { term: 'madrigal', def: 'A composition on a short secular poem, sung by a small group of unaccompanied singers (one on a part). The madrigal flourished in Italy from 1520 to 1610, and was adopted in England during the Elizabethan Age (c. 1600); a contrapuntal song written for at least three voices, usually without accompaniment.' },
    { term: 'maestro', def: 'Refers to any great composer, conductor, or teacher of music.' },
    { term: 'major', def: 'One of the two modes of the tonal system. Music written in major keys have a positive affirming character.' },
    { term: 'major key', def: 'Music based on a major scale (traditionally considered "happy" sounding).' },
    { term: 'major scale', def: 'A family of seven alphabetically-ordered pitches within the distance of an octave, following an intervalic pattern matching the white keys from "C" to "C" on a piano.' },
    { term: 'Malagueña', def: 'A Spanish gypsy dance from the region of Málaga.' },
    { term: 'marcato', def: 'Performed with emphasis.' },
    { term: 'march', def: 'A form of music written for marching in two-step time. Originally the march was used for military processions.' },
    { term: 'marching band', def: 'A large ensemble of woodwinds, brass, percussion, and color guard used for entertainment at sporting events and parades (usually performing march-like music in a strong duple meter).' },
    { term: 'marimba', def: 'A pitched percussion instrument comprised of wooden bars struck by mallets that uses resonator tubes to enhance the sound; a more versatile version of the xylophone.' },
    { term: 'Mass', def: 'In music, a composition based on the five daily prayers of the Roman Catholic Mass Ordinary: Kyrie, Gloria, Credo, Sanctus, Agnus Dei.' },
    { term: 'Mass Ordinary', def: 'The five daily prayers of the Catholic Mass: Kyrie, Gloria, Credo, Sanctus, Agnus Dei.' },
    { term: 'Mass Proper', def: 'The approximately two dozen prayers of a Mass that change each day to reflect the particular feast day of the liturgical calendar.' },
    { term: 'mazurka', def: "A type of Polish dance in triple meter, sometimes used by Chopin in his piano works." },
    { term: 'measure', def: 'A rhythmic grouping, set off in written music by a vertical barline.' },
    { term: 'Medieval', def: 'A term used to describe things related to the Middle Ages (c450–1450).' },
    { term: 'medley', def: 'Often used in overtures, a composition that uses passages from other movements of the composition in its entirety.' },
    { term: 'melisma', def: 'A succession of many pitches sung while sustaining one syllable of text.' },
    { term: 'mellophone', def: 'Marching band version of a French horn.' },
    { term: 'mellophonium', def: 'Hybrid version of a French horn and euphonium, typically used for marching band.' },
    { term: 'melody', def: 'The musical element that deals with the horizontal presentation of pitch.' },
    { term: 'meter', def: 'Beats organized into recurring and recognizable accent patterns (2/4, 3/4, 4/4, etc.).' },
    { term: 'metronome', def: 'A mechanical (or electric) device that precisely measures tempo.' },
    { term: 'mezzo-', def: 'An Italian prefix that means medium or half; vocally, the voice between soprano and alto.' },
    { term: 'mezzo-forte', def: 'A medium loud dynamic marking.' },
    { term: 'mezzo-piano', def: 'A medium quiet dynamic marking.' },
    { term: 'mezzo-soprano', def: "A dramatic woman's voice that combines the power of an alto with the primary high range of a soprano." },
    { term: 'microtone', def: 'A non-Western musical interval that is smaller than a Western half-step.' },
    { term: 'Middle Ages', def: 'c450–1450; an era dominated by Catholic sacred music, which began as simple chant but grew in complexity in the 13th to 15th centuries by experiments in harmony and rhythm.' },
    { term: 'MIDI', def: 'An acronym for Musical Instrument Digital Interface; a protocol established in the 1970s that allows digital synthesizers to communicate with computers.' },
    { term: 'minimalism', def: 'A modern compositional approach promoted by Glass, Reich, etc., in which a short melodic/rhythmic/harmonic idea is repeated and gradually transformed as the basis of an extended work.' },
    { term: 'minor', def: 'One of the two modes of the tonal system. The minor mode can be identified by the dark, melancholic mood.' },
    { term: 'minor key', def: 'Music based on a minor scale (traditionally considered "sad" sounding).' },
    { term: 'minor scale', def: 'A family of seven alphabetically-ordered pitches within the distance of an octave, following an intervalic pattern matching the white keys from "A" to "A" on a piano.' },
    { term: 'minuet', def: 'A popular aristocratic French dance in 3/4 meter from the mid-17th century to the end of the 18th century.' },
    { term: 'minuet and trio form', def: 'The traditional third-movement form of the Classic 4-movement design, based on an aristocratic dance in 3/4 meter.' },
    { term: 'mode', def: 'A scale or key used in a musical composition (major and minor are modes, as are ancient modal scales found in Western music before c.1680).' },
    { term: 'moderato', def: 'A moderate tempo.' },
    { term: 'Modern Era', def: 'c1890–present; a musical era impacted by daring experimentation, advances in musical technology, and popular/non-Western influences (Debussy, Schoenberg, Stravinsky, Copland, Cage).' },
    { term: 'modulation', def: 'The process of changing from one musical key to another.' },
    { term: 'monophonic texture', def: 'A single-line texture with no harmony.' },
    { term: 'monotone', def: 'Repetition of a single tone.' },
    { term: 'motet', def: 'A polyphonic vocal piece set to a sacred Latin text that is not from the Roman Catholic Mass.' },
    { term: 'motif', def: 'Primary theme or subject that is developed.' },
    { term: 'motive', def: "A small musical fragment ("Lego" block) used to build a larger musical idea; can be reworked in the course of a composition (as in the 4-note motive in Beethoven's Symphony No. 5 in C minor)." },
    { term: 'movement', def: 'A complete, independent division of a larger work.' },
    { term: 'mp3', def: 'A modern technology that allows digital CD-quality sound to be compressed into files that are approximately 8 times smaller than the original, with relatively little loss of quality.' },
    { term: 'musette', def: 'A Baroque dance with a drone-bass.' },
    { term: 'musicology', def: 'The study of forms, history, science, and methods of music.' },
    { term: 'Musikdrama', def: 'A type of ultra-dramatic German operatic theatre developed by Richard Wagner in the mid-/late-Romantic era.' },
    { term: 'musique concrète', def: 'Music comprised of natural sounds that are recorded and/or manipulated electronically or via magnetic tape; a compositional approach promoted by Varèse in the 1950s.' },
    { term: 'mute', def: 'A device used to muffle the tone and volume of an instrument.' },
  ]},
  { letter: 'N', terms: [
    { term: 'nationalism', def: "Musical styles that include folk songs, dances, legends, language, or other national imagery relating to a composer's native country." },
    { term: 'natural', def: 'A note which is neither sharp nor flat.' },
    { term: 'natural sign', def: 'A symbol in sheet music that returns a note to its original pitch after it has been augmented or diminished.' },
    { term: 'Neoclassical', def: 'An early 20th-century compositional style in which Classic forms and the aesthetics of balance, clarity and structural unity are combined with modern approaches to harmony, rhythm and tone color; crisp and direct.' },
    { term: 'new age', def: "A style of popular music in the 1980s/90s that rejected the hard-edged beat of rock music by focusing on nature sounds, sweet synthesized tone colors, acoustic instruments and short hypnotically-repetitive ideas." },
    { term: 'nocturne', def: '(French for "night piece") A type of character piece for solo piano that evokes the moods and images of nighttime; romantic or dreamy character with nocturnal associations.' },
    { term: 'nonet', def: 'A composition written for nine instruments.' },
    { term: 'non-metrical', def: 'Music without a regular beat or steady meter (you cannot tap your foot to the beat).' },
    { term: 'non-Western music', def: 'Music from countries other than Europe and the Americas.' },
    { term: 'notation', def: 'A system first developed in the 8th century for writing music down so that critical aspects of its performance can be recreated accurately.' },
    { term: 'note', def: 'In music notation, a black or white oval-shaped symbol (with or without a stem/flag) that represents a specific rhythmic duration and/or pitch.' },
  ]},
  { letter: 'O', terms: [
    { term: 'obbligato', def: '1) An instrumental part which is essential in a piece of music, popular in the baroque period; 2) an extended solo, often accompanying the vocal part of an aria.' },
    { term: 'oboe', def: 'A nasal-sounding double-reed instrument that is the alto of the standard woodwind family.' },
    { term: 'octave', def: 'Eight full tones above the key note where the scale begins and ends (e.g. from C to C or D to D); a musical interval between two pitches in which the upper pitch vibrates twice as fast as the lower.' },
    { term: 'octet', def: 'A composition written for eight instruments.' },
    { term: 'Ondes Martenot', def: 'An electronic instrument which produces sound using a keyboard which controls oscillating frequencies.' },
    { term: 'opera', def: 'A large-scale, fully-staged dramatic theatrical work involving solo singers, chorus and orchestra.' },
    { term: 'opera buffa', def: 'Comic Italian opera (usually in 2 acts).' },
    { term: 'opera seria', def: 'Serious Italian opera (usually in 3 acts).' },
    { term: 'operetta', def: 'Short light musical drama.' },
    { term: 'opus', def: 'Convenient method of numbering a composer\'s works where a number follows the word "opus". For example, Opus 28, No. 4.' },
    { term: 'oratorio', def: 'A large scale work for orchestra and voices, usually sacred in nature. Oratorios are narrative in the same way as opera, but are performed without staging, costume, action or scenery.' },
    { term: 'orchestra', def: 'A large instrumental ensemble comprised of strings, woodwinds, brasses and percussion.' },
    { term: 'orchestration', def: 'The technique of conceiving or arranging a composition for orchestra.' },
    { term: 'organ', def: "A wind/keyboard instrument, usually with many sets of pipes controlled from two or more manuals (keyboards), including a set of pedals played by the organist's feet." },
    { term: 'organum', def: 'A type of early French Medieval polyphony dating from c. 1000–1200, featuring a slow non-metered chant in the lowest voice with one or more faster metrical voices sung above.' },
    { term: 'ornaments', def: 'Tones used to embellish the principal melodic tone.' },
    { term: 'ostinato', def: 'A short rhythmic/melodic idea that is repeated exactly over and over throughout a musical section or work.' },
    { term: 'overture', def: 'A one-movement orchestral introduction to an opera or other large musical work.' },
  ]},
  { letter: 'P', terms: [
    { term: 'parody', def: 'Composition based on previous work. A common technique used in Medieval and Renaissance music.' },
    { term: 'part', def: 'A line in a contrapuntal work performed by an individual voice or instrument.' },
    { term: 'partial', def: 'A harmonic given off by a note when it is played.' },
    { term: 'partial chord', def: 'A harmonic combination that has two pitches sounding simultaneously; see also chord.' },
    { term: 'partita', def: 'Musical suite, usually for solo instrument or small ensemble; often Baroque dances.' },
    { term: 'passacaglia', def: 'A baroque dance form in which a short melodic phrase, usually in the bass, forms the basis of the work.' },
    { term: 'pastoral', def: 'A composition whose style is simple and idyllic; suggestive of rural scenes.' },
    { term: 'pentatonic scale', def: 'A folk or non-Western scale having five different notes (consisting of the black notes on the keyboard) within the space of an octave.' },
    { term: 'percussion instrument', def: 'An instrument on which sound is generated by striking its surface with an object.' },
    { term: 'phrase', def: 'A small musical unit (sub-section of a melody) equivalent to a grammatical phrase in a sentence.' },
    { term: 'pianissimo', def: 'A very quiet dynamic marking.' },
    { term: 'piano', def: '(Dynamic) A soft/quiet dynamic marking. (Instrument) A versatile modern keyboard instrument that makes sound via fingered keys that engage felt-tipped hammers that strike the strings.' },
    { term: 'pianoforte', def: 'The original instrumental prototype of the piano (late Baroque/early Classic eras).' },
    { term: 'pitch', def: 'The relative highness or lowness of a musical sound (based on frequency of vibration).' },
    { term: 'più', def: 'A term that can preface an instruction to mean "more of". "Più vivo" means "more lively"; "Più lento" means "more slow".' },
    { term: 'pizzicato', def: 'Usually refers to a type of stringed instrument playing in which a string is plucked by the fingers.' },
    { term: 'poco a poco', def: 'A term that can preface an instruction meaning to follow it "little by little". For example, "poco a poco crescendo" means getting louder gradually, little by little.' },
    { term: 'polka', def: 'A lively Bohemian (Czech) dance (traditionally for the common classes).' },
    { term: 'polonaise', def: "A Polish nationalistic military dance used in some of Chopin's piano character pieces." },
    { term: 'polyphony', def: 'Music with two or more sounds happening simultaneously; combining a number of individual but harmonizing melodies. Also known as counterpoint.' },
    { term: 'polyphonic texture', def: 'When two or more independent melodic lines are sounding at the same time.' },
    { term: 'polyrhythm', def: 'When several independent rhythmic lines are sounding at the same time.' },
    { term: 'polytonality', def: 'When music is played in two or more contrasting keys at the same time.' },
    { term: 'portamento', def: 'A mild glissando between two notes for an expressive effect.' },
    { term: 'postlude', def: 'A concluding section (usually at the end of a keyboard movement).' },
    { term: 'prelude', def: '1) A free-form introductory movement to a fugue or other more complex composition; 2) a term used instead of overture to show dramatic unity between the introductory orchestral music and the theatrical drama that follows it.' },
    { term: 'prepared piano', def: 'A modern technique invented by John Cage in which various natural objects (spoons, erasers, screws, etc.) are strategically inserted between the strings of a piano, in order to create unusual sounds.' },
    { term: 'presto', def: 'A very fast tempo.' },
    { term: 'program music', def: 'Instrumental music intended to tell a specific story, or set a specific mood or extra-musical image.' },
    { term: 'program symphony', def: 'A programmatic multi-movement work for orchestra.' },
    { term: 'progression', def: 'The movement of chords in succession that functions similarly to a sentence or phrase in written language.' },
  ]},
  { letter: 'Q', terms: [
    { term: 'quadrille', def: 'A 19th century square dance written for 4 couples.' },
    { term: 'quadruple meter', def: 'A basic metrical pattern having four beats per measure.' },
    { term: 'quarter-tone', def: 'A division of pitches, smaller than a semitone, which is half a tone. Found generally in some music from the 20th Century.' },
    { term: 'quartet', def: 'A set of four musicians who perform a composition written for four parts.' },
    { term: 'quintet', def: 'A set of five musicians who perform a composition written for five parts.' },
    { term: 'quotation music', def: '(Common since c. 1960) A composition extensively using quotations from earlier works.' },
  ]},
  { letter: 'R', terms: [
    { term: 'raga', def: 'A melodic pattern used in the music of India.' },
    { term: 'ragtime', def: 'A style of piano music developed around the turn of the 20th century, with a march-like tempo, a syncopated right-hand melody, and an "oom-pah" left-hand accompaniment.' },
    { term: 'rallentando', def: 'Often abbreviated as "rall...", is an instruction to gradually play slower.' },
    { term: 'range', def: 'The distance between the lowest and highest possible notes of an instrument or melody.' },
    { term: 'rap', def: '(Hip-hop) A style of popular music developed by Americans in the 1970s, in which the lyrics are spoken over rhythm tracks.' },
    { term: 'recapitulation', def: 'The third aspect of Classic sonata form; in this section, both themes of the exposition are restated in the home key (the second theme gives up its opposing key center); reprise.' },
    { term: 'recital', def: 'A solo concert with or without accompaniment.' },
    { term: 'recitative', def: 'A speech-like style of singing with a free rhythm over a sparse accompaniment.' },
    { term: 'recorder', def: 'An ancient wooden flute.' },
    { term: 'reed', def: 'A flexible strip of cane (or metal) that vibrates in the mouthpiece of a wind instrument.' },
    { term: 'refrain', def: 'Repeating phrase that is played at the end of each verse in the song.' },
    { term: 'register', def: 'A specific coloristic portion of an instrumental or vocal range.' },
    { term: 'relative major and minor', def: 'The major and minor keys that share the same notes in that key. For example: A minor shares the same notes as C major.' },
    { term: 'relative pitch', def: 'Ability to determine the pitch of a note as it relates to the notes that precede and follow it.' },
    { term: 'Renaissance', def: 'c1450–1600; an era that witnessed the rebirth of learning and exploration. This was reflected musically in a more personal style than seen in the Middle Ages (Josquin Desprez, Palestrina, Weelkes).' },
    { term: 'reprise', def: 'To repeat a previous part of a composition generally after other music has been played.' },
    { term: 'Requiem Mass', def: 'A dirge, hymn, or musical service (most times Roman Catholic) for the repose of the dead.' },
    { term: 'resonance', def: 'When several strings are tuned to harmonically related pitches, all strings vibrate when only one of the strings is struck.' },
    { term: 'retrograde', def: 'A melody presented in backwards motion.' },
    { term: 'retrograde inversion', def: 'A melody presented backwards and intervalically upside down.' },
    { term: 'rhythm', def: 'The element of music as it unfolds in time; played as a grouping of notes into accented and unaccented beats.' },
    { term: 'rhythm and blues', def: 'A style of American popular music that flourished in the 1940s–60s; a direct predecessor to rock and roll.' },
    { term: 'ricercar', def: 'Elaborate polyphonic composition of the Baroque and Renaissance periods.' },
    { term: 'rigaudon', def: 'A quick 20th century dance written in double time.' },
    { term: 'ritardando', def: 'Gradually slowing down the tempo, often abbreviated as "rit."' },
    { term: 'ritenuto', def: 'An instruction to slow down.' },
    { term: 'ritornello form', def: 'A Baroque design that alternates big vs. small effects (tutti vs. solo); usually the tutti section is a recurring melodic refrain.' },
    { term: 'rock and roll', def: 'An American style of popular music that emerged in the 1950s out of the combination of rhythm and blues, country-western and pop-music elements.' },
    { term: 'rococo', def: 'A musical style characterized as excessive, ornamental, and trivial.' },
    { term: 'Romantic Era', def: 'c1820–1890; an era of flamboyance, nationalism, the rise of "superstar" performers, and concerts aimed at middle-class "paying" audiences. (Schubert, Berlioz, Chopin, Wagner, Brahms, Tchaikovsky).' },
    { term: 'rondo form', def: 'A Classic form in which a main melodic idea returns two or three times in alternation with other melodies (ABACA or ABACABA, etc.); often used for final movements of classical sonata form works.' },
    { term: 'root', def: 'The principal note of a triad.' },
    { term: 'round', def: 'A canon where the melody is sung in two or more voices. After the first voice begins, the next voice starts singing after a couple of measures are played in the preceding voice. All parts repeat continuously.' },
    { term: 'rubato', def: 'A flexible approach to metered rhythm in which the tempo can be momentarily sped up or slowed down at will for greater personal expression; an important characteristic of the Romantic period.' },
  ]},
  { letter: 'S', terms: [
    { term: 'sackbut', def: 'An ancient brass instrument; ancestor to the trombone.' },
    { term: 'saxophone', def: 'A family of woodwind instruments with a single reed and brass body; commonly used in jazz and marching band/concert band music.' },
    { term: 'scale', def: 'A family of pitches arranged in an ascending/descending order.' },
    { term: 'scat singing', def: 'A style of improvised jazz singing sung on colorful nonsense syllables.' },
    { term: 'scherzo', def: 'Pertaining to the sonata form, a fast movement in triple time. Originating in the 17th Century, the form usually appears in a Symphony as a fast, light-hearted second or third movement.' },
    { term: 'scherzo and trio form', def: 'A musical movement based on a country dance in triple meter; replaced the aristocratic minuet in the early 1800s as the usual third movement of the Classic 4-movement design.' },
    { term: 'scordatura', def: 'The retuning of a stringed instrument in order to play notes below the ordinary range of the instrument or to produce an unusual tone color.' },
    { term: 'score', def: 'Written notation that vertically aligns all instrumental/vocal parts used in a composition.' },
    { term: 'septet', def: 'A set of seven musicians who perform a composition written for seven parts.' },
    { term: 'sequence', def: 'The immediate transposition and repetition of a melodic passage on a higher or lower pitch level.' },
    { term: 'serenade', def: 'A lighthearted Classic instrumental chamber work written in several movements similar to a small-scale symphony; usually performed for social entertainment of the upper classes.' },
    { term: 'serialism', def: 'A method of modern composition in which the twelve chromatic pitches are put into a numerically-ordered series used to control various aspects of a work (melody, harmony, tone color, dynamics, instrumentation, etc.).' },
    { term: 'sextet', def: 'A set of six musicians who perform a composition written for six parts.' },
    { term: 'sforzando', def: 'Play with sudden and marked emphasis; sudden stress on a note or chord.' },
    { term: 'shakuhachi', def: 'A Japanese flute.' },
    { term: 'shamisen', def: 'A banjo-like Japanese stringed instrument.' },
    { term: 'sharp sign', def: 'A musical symbol that raises the pitch one half-step.' },
    { term: 'shawm', def: 'An ancient double-reed woodwind instrument.' },
    { term: 'Singspiel', def: 'A traditionally low-level type of comic light opera, featuring spoken German dialogue interspersed with simple German songs.' },
    { term: 'sitar', def: 'A long-necked stringed instrument of India.' },
    { term: 'slide', def: 'A glissando or portamento. Also refers to the moving part of a trombone.' },
    { term: 'slur', def: 'A curve over notes to indicate that a phrase is to be played legato.' },
    { term: 'snare drum', def: 'A non-pitched drum with two heads stretched over a metal shell; the lower head has metal wires strapped across it to produce a rattling sound.' },
    { term: 'solo concerto', def: 'A 3-movement work for a single soloist vs. an orchestra.' },
    { term: 'sonata', def: 'A Classic multi-movement work for a piano (or for one instrument with piano accompaniment); music of a particular form consisting of four movements.' },
    { term: 'sonata form', def: 'The common first-movement form of Classic multi-movement instrumental works; essentially a musical debate between two opposing key centers characterized by three structural divisions: Exposition, Development, and Recapitulation.' },
    { term: 'sonata-rondo form', def: 'A formal design that combines aspects of sonata form and rondo form (an ABACABA design).' },
    { term: 'sonatina', def: 'A short or brief sonata.' },
    { term: 'song', def: 'A small-scale musical work that is sung (a German song is a "Lied"; a French song is a "chanson"; an Italian song is a "canzona").' },
    { term: 'song cycle', def: 'A set of poetically-unified songs for one singer accompanied by either piano or orchestra; a sequence of songs, perhaps on a single theme, or with texts by one poet, or having continuous narrative.' },
    { term: 'soprano', def: "1) The highest ranged woman's voice or a high pre-pubescent boy's voice; 2) the highest-sounding instrument of an instrumental family. Instrument examples: flute, clarinet, recorder, violin, trumpet, oboe, soprano saxophone." },
    { term: 'sousaphone', def: 'An ultra-bass brass instrument designed for use in marching bands.' },
    { term: 'Sprechstimme', def: 'A half-spoken, half-sung style of singing on approximate pitches, developed by Schoenberg in the early 1900s.' },
    { term: 'staccato', def: 'Short, detached notes.' },
    { term: 'staff', def: 'Made up of five horizontal parallel lines and the spaces between them on which musical notation is written.' },
    { term: 'stretto', def: 'Pertaining to the fugue, the overlapping of the same theme or motif by two or more voices a few beats apart.' },
    { term: 'string instrument', def: 'An instrument that is played by placing one\'s hands directly on the strings, such as violin, viola, cello, double bass, harp, guitar, dulcimer, psaltery, and the ancient viols.' },
    { term: 'string quartet', def: '1) A chamber ensemble of two violins, viola, and cello, devised in the early Classic era; 2) a multi-movement work for two violins, viola and cello.' },
    { term: 'strophic form', def: 'A song form featuring several successive verses of text sung to the same music.' },
    { term: 'subject', def: 'The main melodic idea of a fugue.' },
    { term: 'suite', def: 'A loose collection of instrumental compositions.' },
    { term: 'swing', def: 'A term to describe "Big Band" jazz music of the 1930s–50s.' },
    { term: 'symphonic poem', def: 'A single-movement programmatic work for orchestra.' },
    { term: 'symphony', def: 'A large scale orchestral work, usually in four movements, in which at least one is in sonata-form.' },
    { term: 'syncopation', def: 'An "off-the-beat" accent.' },
    { term: 'synthesizer', def: 'A modern electronic keyboard instrument capable of generating a multitude of sounds.' },
    { term: 'system', def: 'A combination of two or more staves on which all the notes are vertically aligned and performed simultaneously in differing registers and instruments.' },
  ]},
  { letter: 'T', terms: [
    { term: 'tabla', def: 'A pair of drums used to accompany the music of India.' },
    { term: 'tablature', def: 'A system of notation for stringed instruments. The notes are indicated by the finger positions.' },
    { term: 'tala', def: 'A rhythmic pattern used in the music of India.' },
    { term: 'temperament', def: 'Refers to the tuning of an instrument.' },
    { term: 'tempo', def: 'The speed of the musical beat at which a piece of music is played.' },
    { term: 'tenor', def: 'A male singing voice between baritone and countertenor. The highest of the ordinary adult male range. Instrument examples: trombone, tenor saxophone.' },
    { term: 'tenuto', def: 'A note or chord held for its full time value or slightly more.' },
    { term: 'ternary form', def: 'ABA design (statement, contrast, restatement).' },
    { term: 'tessitura', def: 'The range of an instrumental or a vocal part.' },
    { term: 'texture', def: 'The element focusing on the number of simultaneous musical lines being sounded.' },
    { term: 'theme', def: 'A melodic or, sometimes a harmonic idea presented in a musical form.' },
    { term: 'theme and variations form', def: 'A theme is stated then undergoes a series of sectional alterations.' },
    { term: 'through-composed form', def: 'A song form with no large-scale musical repetition.' },
    { term: 'timbre', def: 'Tone color, quality of sound that distinguishes one instrument to another. It is determined by the harmonics of sound.' },
    { term: 'time signature', def: 'A numeric symbol in sheet music determining the number of beats to a measure.' },
    { term: 'timpani', def: 'Various-sized kettle-shaped pitched drums; a tenor instrument of the percussion family.' },
    { term: 'toccata', def: 'An instrumental work designed to display the technical prowess and proficiency of a performer.' },
    { term: 'tonal', def: 'Pertains to tone or tones.' },
    { term: 'tonality', def: 'Music centered around a "home" key (based on a major or minor scale).' },
    { term: 'tone', def: 'The intonation, pitch, and modulation of a composition expressing the meaning, feeling, or attitude of the music.' },
    { term: 'tone color', def: 'The unique, characteristic sound of a musical instrument or voice.' },
    { term: 'tone cluster', def: 'A modern technique of extreme harmonic dissonance created by a large block of pitches sounding simultaneously.' },
    { term: 'tone row', def: 'An ordered series of twelve chromatic pitches used in serialism.' },
    { term: 'tonic', def: 'The first note of a scale or key; also known as a keynote.' },
    { term: 'tonic key', def: 'The "home" key of a tonal composition.' },
    { term: 'transition', def: 'A bridge section between two musical ideas.' },
    { term: 'transposition', def: 'Shifting a piece to a different pitch level.' },
    { term: 'treble', def: 'The playing or singing the upper half of the vocal range. Also the highest voice in choral singing.' },
    { term: 'tremolo', def: 'Rapid repetition of a pitch (i.e.: bowing a string rapidly while maintaining a constant pitch).' },
    { term: 'triad', def: 'A three-note chord consisting of a root, third, and fifth (built on alternating scale steps — 1-3-5, etc.).' },
    { term: 'trill', def: 'Rapid alternation of two close pitches to create a "shaking" ornament on a melodic note.' },
    { term: 'trio', def: 'A composition written for three voices and instruments performed by three persons.' },
    { term: 'trio sonata', def: 'A Baroque multi-movement chamber work for four performers (2 violins and basso continuo).' },
    { term: 'triple meter', def: 'A common meter with three beats per measure.' },
    { term: 'triplet', def: 'A rhythmic grouping of three equal-valued notes played in the space of two (indicated in written music by a "3" above the grouping).' },
    { term: 'tritone', def: 'A chord comprised of three whole tones resulting in an augmented fourth or diminished fifth.' },
    { term: 'trombone', def: 'A family of brass instruments that change pitch via a moveable slide (alto, tenor and bass versions are common).' },
    { term: 'trumpet', def: 'A valved instrument that is the soprano of the modern brass family.' },
    { term: 'tuba', def: 'A large valved brass instrument; the bass of the modern brass family.' },
    { term: 'tubular bells', def: 'See chimes.' },
    { term: 'tune', def: 'A rhythmic succession of musical tones, a melody for instruments and voices.' },
    { term: 'tuning', def: 'The raising and lowering a pitch of an instrument to produce the correct tone of a note.' },
    { term: 'tutti', def: '(Italian for "all" or "everyone") An indication for all performers to play together.' },
    { term: 'twelve-tone music', def: 'Music composed such that each note is used the same number of times.' },
  ]},
  { letter: 'U', terms: [
    { term: "'Ud", def: 'A lute-like, pear-shaped, fretless stringed instrument commonly used in music from the Middle East.' },
    { term: 'unison', def: 'The rendering of a single melodic line by several performers simultaneously.' },
    { term: 'upbeat', def: 'The weak beat that comes before the strong downbeat of a musical measure.' },
  ]},
  { letter: 'V', terms: [
    { term: 'variation', def: 'The compositional process of changing an aspect(s) of a musical work while retaining others.' },
    { term: 'verismo', def: 'A style of true-to-life Italian opera that flourished at the turn of the 20th century.' },
    { term: 'vibraphone', def: 'Percussion instrument made of tuned metal bars played by holding two or four soft mallets and striking the bars. Features resonator tubes with motor-driven valves producing a tremolo/vibrato effect while spinning. Also has a sustain pedal similar to that on a piano.' },
    { term: 'vibrato', def: 'Small fluctuations in pitch used to make a sound more expressive.' },
    { term: 'viol', def: 'An ancient string instrument (ancestor to the modern violin).' },
    { term: "viol' da gamba", def: 'A Renaissance bowed string instrument held between the legs like a modern cello.' },
    { term: 'viola', def: 'The alto instrument of the modern string family.' },
    { term: 'violin', def: 'The soprano instrument of the modern string family.' },
    { term: 'violoncello', def: 'The full name of the cello; the tenor instrument of the modern string family.' },
    { term: 'virtuoso', def: 'A performer of extraordinary ability.' },
    { term: 'vivace', def: 'A lively tempo; to be played in a brisk, lively, and spirited manner.' },
    { term: 'voice', def: 'One of two or more parts in polyphonic music. Voice refers to instrumental parts as well as the singing voice.' },
    { term: 'volume', def: 'The relative quietness or loudness of an electrical impulse (see dynamics).' },
  ]},
  { letter: 'W', terms: [
    { term: 'waltz', def: 'An aristocratic ballroom dance in triple meter where the accent falls on the first beat of each measure; flourished in the Romantic period.' },
    { term: 'whole note', def: 'A whole note is equal to 2 half notes, 4 quarter notes, 8 eighth notes, etc.' },
    { term: 'whole step', def: 'An interval twice as large as a half-step (e.g. the distance between C and D on a piano).' },
    { term: 'whole-tone scale', def: 'A scale made of 6 whole steps that avoids any sense of tonality (e.g. C D E F# G# A#).' },
    { term: 'woodwind instrument', def: 'An instrument that produces its sound from a column of air vibrating within a multi-holed tube.' },
    { term: 'word-painting', def: 'In vocal music, musical gestures that reflect the specific meaning of words; a common aspect of the Renaissance madrigal.' },
    { term: 'world beat', def: 'The collective term for today\'s popular third-world musical styles (also called ethno-pop).' },
  ]},
  { letter: 'X', terms: [
    { term: 'xylophone', def: 'A pitched percussion instrument consisting of flat wooden bars on a metal frame that are struck by hard mallets.' },
  ]},
];

const MARCHING_TERMS: Term[] = [
  { term: 'call time', def: 'The absolute latest time you should be in place and fully prepared for a band activity. Band students plan to arrive 30 minutes prior to published call times. (If you are 15 minutes EARLY for Call Time then you are on time; if you show up AT Call Time then you are late.)' },
  { term: 'dot', def: 'A full Marching Band Drill contains many pages with numbered dots on them. Each marcher is assigned one of these dots. In visual terms, a marcher moves in step during a performance just like the dot in the book does.' },
  { term: 'drill & dot books', def: 'For Section Leaders, a drill book is a 3-ring binder that holds pages with the full marching drill (all the moves marchers make during a performance). A dot book is an inexpensive spiral notebook used by individual marchers to reference just their position in the drill.' },
  { term: 'field marker', def: 'An object placed on the field so you can easily return to it during rehearsal. It can be anything small and relatively flat, like a small stuffed animal, a mini frisbee, a toy car, etc.' },
  { term: 'flip folder', def: 'Used to hold music, in a specifically sized page protector, while marching. Attaches to a lyre.' },
  { term: 'lyre', def: "A piece of hardware that connects a flip folder to either an instrument or a flute player's arm to hold music while it is being learned." },
  { term: 'MSBOA', def: 'The Michigan School Band & Orchestra Association. An organized group of K–12 music educators across the state, coordinating: Marching Band Festival, Band & Orchestra Festival, Jazz Festival, Solo & Ensemble, and Honors groups.' },
];

const LETTERS = GLOSSARY.map(s => s.letter);

const UI = {
  eyebrow:    { en: 'Reference', fr: 'Référence' },
  title:      { en: 'Glossary of Musical Terms', fr: 'Glossaire des termes musicaux' },
  subtitle:   { en: 'Definitions for over 300 musical terms — from articulation marks and historical eras to instruments, forms, and performance techniques.', fr: "Définitions de plus de 300 termes musicaux — des signes d'articulation aux époques historiques, en passant par les instruments, les formes et les techniques d'interprétation." },
  search:     { en: 'Search terms…', fr: 'Rechercher un terme…' },
  noResults:  { en: 'No terms match your search.', fr: 'Aucun terme ne correspond à votre recherche.' },
  marchTitle: { en: 'Helpful Marching Band Terms', fr: 'Termes utiles pour la fanfare' },
  sources:    { en: 'Sources', fr: 'Sources' },
};

export default function GlossaryPage() {
  const { lang } = useLang();
  const [search, setSearch] = useState('');
  const letterRefs = useRef<Record<string, HTMLElement | null>>({});

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return GLOSSARY;
    return GLOSSARY.map(sec => ({
      letter: sec.letter,
      terms: sec.terms.filter(t =>
        t.term.toLowerCase().includes(q) || t.def.toLowerCase().includes(q)
      ),
    })).filter(sec => sec.terms.length > 0);
  }, [search]);

  const totalTerms = filtered.reduce((n, s) => n + s.terms.length, 0);

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--ink)', paddingTop: '80px', minHeight: '100vh' }}>

        {/* Hero */}
        <div className="relative py-24 px-6 text-center overflow-hidden" style={{ background: 'var(--surface)' }}>
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(221,118,52,0.08) 0%, transparent 70%)',
          }} />
          <div className="relative max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full" style={{ background: 'rgba(221,118,52,0.08)', border: '1px solid rgba(221,118,52,0.2)' }}>
              <BookOpen size={14} style={{ color: 'var(--gold)' }} />
              <span className="text-xs font-ui tracking-[0.3em] uppercase" style={{ color: 'var(--gold)' }}>{UI.eyebrow[lang]}</span>
            </div>
            <h1 className="text-5xl font-display mb-4" style={{ color: 'var(--ivory)' }}>{UI.title[lang]}</h1>
            <div className="gold-line w-24 mx-auto mb-5" />
            <p className="font-ui leading-relaxed" style={{ color: 'var(--mist)' }}>{UI.subtitle[lang]}</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">

          {/* Search */}
          <div className="relative mb-10">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--mist)' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={UI.search[lang]}
              className="w-full font-ui text-sm rounded-xl pl-11 pr-5 py-3.5 outline-none"
              style={{
                background: 'var(--surface-2)',
                border: '1px solid rgba(221,118,52,0.2)',
                color: 'var(--ivory)',
              }}
              onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(221,118,52,0.5)'; }}
              onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(221,118,52,0.2)'; }}
            />
          </div>

          {/* Alpha nav — only when not searching */}
          {!search && (
            <div className="flex flex-wrap gap-2 mb-12">
              {LETTERS.map(l => (
                <button
                  key={l}
                  onClick={() => letterRefs.current[l]?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="w-9 h-9 rounded-lg font-ui text-sm font-bold transition-all duration-150"
                  style={{ background: 'var(--surface-2)', color: 'var(--mist)', border: '1px solid rgba(255,255,255,0.06)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(221,118,52,0.15)'; (e.currentTarget as HTMLElement).style.color = 'var(--gold)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'; (e.currentTarget as HTMLElement).style.color = 'var(--mist)'; }}
                >
                  {l}
                </button>
              ))}
            </div>
          )}

          {/* Terms */}
          {totalTerms === 0 ? (
            <p className="font-ui text-center py-16" style={{ color: 'var(--mist)' }}>{UI.noResults[lang]}</p>
          ) : (
            filtered.map(sec => (
              <div
                key={sec.letter}
                ref={el => { letterRefs.current[sec.letter] = el; }}
                className="mb-12"
              >
                {/* Letter heading */}
                <div className="flex items-center gap-4 mb-6">
                  <span
                    className="text-4xl font-display font-bold leading-none"
                    style={{ color: 'var(--gold)' }}
                  >
                    {sec.letter}
                  </span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(221,118,52,0.2)' }} />
                </div>

                {/* Term list */}
                <div className="flex flex-col gap-px">
                  {sec.terms.map((t, i) => (
                    <div
                      key={i}
                      className="flex gap-4 px-5 py-4 rounded-xl transition-colors duration-150"
                      style={{ background: 'var(--surface-2)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(221,118,52,0.05)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'; }}
                    >
                      <span
                        className="font-ui font-bold text-sm shrink-0 pt-0.5"
                        style={{ color: 'var(--gold)', minWidth: '180px' }}
                      >
                        {t.term}
                      </span>
                      <span className="font-ui text-sm leading-relaxed" style={{ color: 'var(--mist)' }}>
                        {t.def}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          {/* Marching Band section — only show when not filtering or search matches */}
          {(!search || MARCHING_TERMS.some(t => t.term.toLowerCase().includes(search.toLowerCase()) || t.def.toLowerCase().includes(search.toLowerCase()))) && (
            <div className="mt-4 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-display font-bold leading-none" style={{ color: 'rgba(221,118,52,0.5)' }}>★</span>
                <h2 className="text-xl font-display" style={{ color: 'var(--ivory)' }}>{UI.marchTitle[lang]}</h2>
                <div style={{ flex: 1, height: '1px', background: 'rgba(221,118,52,0.2)' }} />
              </div>
              <div className="flex flex-col gap-px">
                {MARCHING_TERMS
                  .filter(t => !search || t.term.toLowerCase().includes(search.toLowerCase()) || t.def.toLowerCase().includes(search.toLowerCase()))
                  .map((t, i) => (
                    <div
                      key={i}
                      className="flex gap-4 px-5 py-4 rounded-xl transition-colors duration-150"
                      style={{ background: 'var(--surface-2)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(221,118,52,0.05)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'; }}
                    >
                      <span className="font-ui font-bold text-sm shrink-0 pt-0.5" style={{ color: 'var(--gold)', minWidth: '180px' }}>{t.term}</span>
                      <span className="font-ui text-sm leading-relaxed" style={{ color: 'var(--mist)' }}>{t.def}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Sources */}
          {!search && (
            <p className="font-ui text-xs mt-8 pb-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
              {UI.sources[lang]}: Western Michigan University (wmich.edu), classicalworks.com, classicfm.com
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
