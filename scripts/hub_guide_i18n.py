#!/usr/bin/env python3
"""Hub FAQ + quick-link subtitle translations (en source strings)."""

HUB_GUIDE_REPL: dict[str, list[tuple[str, str]]] = {
    "es": [
        ("<h2 id=\"currentGameTitle\">Select a Game</h2>", "<h2 id=\"currentGameTitle\">Elige un juego</h2>"),
        (
            "<p>Winning 2048 requires both strategy and practice. Here are the essential tips:</p>",
            "<p>Ganar en el 2048 requiere estrategia y práctica. Consejos esenciales:</p>",
        ),
        (
            "<li><strong>Master the corner strategy:</strong> Keep your highest value tile in one corner and build around it.</li>",
            "<li><strong>Domina la esquina:</strong> Mantén la ficha más alta en una esquina y construye alrededor.</li>",
        ),
        (
            "<li><strong>Build in one direction:</strong> Choose left, right, or down as your primary direction and stick to it.</li>",
            "<li><strong>Una dirección principal:</strong> Elige izquierda, derecha o abajo y mantén esa dirección.</li>",
        ),
        (
            "<li><strong>Create cascading merges:</strong> Plan moves that will create multiple merges in sequence.</li>",
            "<li><strong>Fusiones en cadena:</strong> Planifica jugadas que provoquen varias fusiones seguidas.</li>",
        ),
        (
            "<li><strong>Control the board:</strong> Don't let tiles scatter randomly - maintain organized rows and columns.</li>",
            "<li><strong>Controla el tablero:</strong> No dejes las fichas dispersas; mantén filas y columnas ordenadas.</li>",
        ),
        (
            "<li><strong>Practice regularly:</strong> The more you play, the better you'll understand tile movement patterns.</li>",
            "<li><strong>Practica a menudo:</strong> Cuanto más juegues, mejor entenderás el movimiento de las fichas.</li>",
        ),
        (
            "<p>With these techniques, you'll improve your chances of achieving the coveted 2048 tile!</p>",
            "<p>¡Con estas técnicas aumentarás tus posibilidades de alcanzar la ficha 2048!</p>",
        ),
        (
            "<h3 class=\"faq-question\">What is the Origin of 2048 Game?</h3>",
            "<h3 class=\"faq-question\">¿Cuál es el origen del 2048?</h3>",
        ),
        (
            "<p>The 2048 game has an interesting history that traces back to earlier puzzle games:</p>",
            "<p>El 2048 tiene una historia interesante ligada a puzzles anteriores:</p>",
        ),
        (
            "<li><strong>Created by Gabriele Cirulli:</strong> The original 2048 was developed by Italian web developer Gabriele Cirulli in March 2014.</li>",
            "<li><strong>Creado por Gabriele Cirulli:</strong> El 2048 original lo desarrolló el italiano Gabriele Cirulli en marzo de 2014.</li>",
        ),
        (
            "<li><strong>Inspired by Threes!:</strong> The game was inspired by the mobile game \"Threes!\" developed by Asher Vollmer.</li>",
            "<li><strong>Inspirado en Threes!:</strong> El juego se inspiró en el móvil \"Threes!\" de Asher Vollmer.</li>",
        ),
        (
            "<li><strong>Open source project:</strong> Cirulli made 2048 as an open-source project, allowing others to create variations.</li>",
            "<li><strong>Código abierto:</strong> Cirulli lo publicó como open source para que otros crearan variantes.</li>",
        ),
        (
            "<li><strong>Viral success:</strong> The game became a viral sensation within days of its release, with millions of players worldwide.</li>",
            "<li><strong>Éxito viral:</strong> En días se volvió fenómeno mundial con millones de jugadores.</li>",
        ),
        (
            "<li><strong>Educational value:</strong> Many teachers use 2048 to teach mathematical concepts and logical thinking.</li>",
            "<li><strong>Valor educativo:</strong> Muchos profesores lo usan para enseñar matemáticas y lógica.</li>",
        ),
        (
            "<p>Today, 2048 has spawned countless variations and remains one of the most popular number puzzle games on the web!</p>",
            "<p>Hoy el 2048 tiene innumerables variantes y sigue siendo uno de los puzzles numéricos más populares en la web.</p>",
        ),
        ("<h4>Classic 2048</h4>", "<h4>2048 Clásico</h4>"),
        ("<p>Original Game</p>", "<p>Juego original</p>"),
        ("<p>2048 Cars Game</p>", "<p>2048 de coches</p>"),
        ("<p>Sweet & Delicious</p>", "<p>Dulce y delicioso</p>"),
        ("<p>Taylor Swift Game</p>", "<p>2048 de Taylor Swift</p>"),
        ("<p>Disney Princess Theme</p>", "<p>Tema princesas Disney</p>"),
        ("<p>Merge Cats by Nobility</p>", "<p>Gatos por nobleza</p>"),
        ("<p>Minecraft Block Theme</p>", "<p>Tema bloques Minecraft</p>"),
        ("<p>Christmas Theme</p>", "<p>Tema navideño</p>"),
        ("<p>Doge Game</p>", "<p>Juego Doge</p>"),
        ("<p>Card Puzzle Game</p>", "<p>Puzzle de cartas</p>"),
        ("<p>2048 Game Unblocked</p>", "<p>2048 desbloqueado</p>"),
        ("<p>Relaxing Game</p>", "<p>Juego relajado</p>"),
        ("<p>Hexagonal Grid</p>", "<p>Cuadrícula hexagonal</p>"),
        ("<p>Flappy Bird Meets 2048</p>", "<p>Flappy Bird y 2048</p>"),
        ("<p>Mental Training Game</p>", "<p>Entrenamiento mental</p>"),
        ("<p>Black & White Number Puzzle</p>", "<p>Puzzle numérico blanco y negro</p>"),
        ("<p>Hacking Puzzle Game</p>", "<p>Puzzle estilo hacker</p>"),
        ("<p>Space Puzzle Game</p>", "<p>Puzzle espacial</p>"),
        ("<p>Classic Brick Breaker</p>", "<p>Rompe ladrillos clásico</p>"),
        ("<p>Space Adventure Game</p>", "<p>Aventura espacial</p>"),
        ("<p>Endless Runner Game</p>", "<p>Corredor infinito</p>"),
        ("<p>Rhythm Platform Game</p>", "<p>Plataformas rítmicas</p>"),
        ("<p>Math & Space Game</p>", "<p>Mates y espacio</p>"),
        ("<p>Classic Sliding Tile Game</p>", "<p>Puzzle deslizante clásico</p>"),
    ],
    "fr": [
        ("<h2 id=\"currentGameTitle\">Select a Game</h2>", "<h2 id=\"currentGameTitle\">Choisir un jeu</h2>"),
        (
            "<p>Winning 2048 requires both strategy and practice. Here are the essential tips:</p>",
            "<p>Gagner au 2048 demande stratégie et pratique. Conseils essentiels :</p>",
        ),
        (
            "<li><strong>Master the corner strategy:</strong> Keep your highest value tile in one corner and build around it.</li>",
            "<li><strong>Stratégie du coin :</strong> Gardez la tuile la plus haute dans un coin et construisez autour.</li>",
        ),
        (
            "<li><strong>Build in one direction:</strong> Choose left, right, or down as your primary direction and stick to it.</li>",
            "<li><strong>Une direction principale :</strong> Choisissez gauche, droite ou bas et tenez-vous-y.</li>",
        ),
        (
            "<li><strong>Create cascading merges:</strong> Plan moves that will create multiple merges in sequence.</li>",
            "<li><strong>Fusions en chaîne :</strong> Planifiez des coups qui créent plusieurs fusions d'affilée.</li>",
        ),
        (
            "<li><strong>Control the board:</strong> Don't let tiles scatter randomly - maintain organized rows and columns.</li>",
            "<li><strong>Contrôlez le plateau :</strong> Évitez le désordre ; gardez lignes et colonnes organisées.</li>",
        ),
        (
            "<li><strong>Practice regularly:</strong> The more you play, the better you'll understand tile movement patterns.</li>",
            "<li><strong>Pratiquez souvent :</strong> Plus vous jouez, mieux vous lisez les mouvements des tuiles.</li>",
        ),
        (
            "<p>With these techniques, you'll improve your chances of achieving the coveted 2048 tile!</p>",
            "<p>Avec ces techniques, vous augmenterez vos chances d'atteindre la tuile 2048 !</p>",
        ),
        (
            "<h3 class=\"faq-question\">What is the Origin of 2048 Game?</h3>",
            "<h3 class=\"faq-question\">Quelle est l'origine du 2048 ?</h3>",
        ),
        (
            "<p>The 2048 game has an interesting history that traces back to earlier puzzle games:</p>",
            "<p>Le 2048 a une histoire liée à des puzzles plus anciens :</p>",
        ),
        (
            "<li><strong>Created by Gabriele Cirulli:</strong> The original 2048 was developed by Italian web developer Gabriele Cirulli in March 2014.</li>",
            "<li><strong>Créé par Gabriele Cirulli :</strong> Le 2048 original est de l'Italien Gabriele Cirulli (mars 2014).</li>",
        ),
        (
            "<li><strong>Inspired by Threes!:</strong> The game was inspired by the mobile game \"Threes!\" developed by Asher Vollmer.</li>",
            "<li><strong>Inspiré de Threes! :</strong> Le jeu s'inspire du mobile « Threes! » d'Asher Vollmer.</li>",
        ),
        (
            "<li><strong>Open source project:</strong> Cirulli made 2048 as an open-source project, allowing others to create variations.</li>",
            "<li><strong>Open source :</strong> Cirulli l'a publié en open source pour de nombreuses variantes.</li>",
        ),
        (
            "<li><strong>Viral success:</strong> The game became a viral sensation within days of its release, with millions of players worldwide.</li>",
            "<li><strong>Succès viral :</strong> En quelques jours, des millions de joueurs dans le monde.</li>",
        ),
        (
            "<li><strong>Educational value:</strong> Many teachers use 2048 to teach mathematical concepts and logical thinking.</li>",
            "<li><strong>Valeur éducative :</strong> Beaucoup d'enseignants l'utilisent pour les maths et la logique.</li>",
        ),
        (
            "<p>Today, 2048 has spawned countless variations and remains one of the most popular number puzzle games on the web!</p>",
            "<p>Aujourd'hui le 2048 compte d'innombrables variantes et reste un puzzle numérique phare sur le web !</p>",
        ),
        ("<h4>Classic 2048</h4>", "<h4>2048 Classique</h4>"),
        ("<p>Original Game</p>", "<p>Jeu original</p>"),
        ("<p>2048 Cars Game</p>", "<p>2048 voitures</p>"),
        ("<p>Sweet & Delicious</p>", "<p>Doux et délicieux</p>"),
        ("<p>Taylor Swift Game</p>", "<p>2048 Taylor Swift</p>"),
        ("<p>Disney Princess Theme</p>", "<p>Thème princesses Disney</p>"),
        ("<p>Merge Cats by Nobility</p>", "<p>Chats par noblesse</p>"),
        ("<p>Minecraft Block Theme</p>", "<p>Thème blocs Minecraft</p>"),
        ("<p>Christmas Theme</p>", "<p>Thème de Noël</p>"),
        ("<p>Doge Game</p>", "<p>Jeu Doge</p>"),
        ("<p>Card Puzzle Game</p>", "<p>Puzzle de cartes</p>"),
        ("<p>2048 Game Unblocked</p>", "<p>2048 débloqué</p>"),
        ("<p>Relaxing Game</p>", "<p>Jeu relaxant</p>"),
        ("<p>Hexagonal Grid</p>", "<p>Grille hexagonale</p>"),
        ("<p>Flappy Bird Meets 2048</p>", "<p>Flappy Bird et 2048</p>"),
        ("<p>Mental Training Game</p>", "<p>Entraînement mental</p>"),
        ("<p>Black & White Number Puzzle</p>", "<p>Puzzle noir et blanc</p>"),
        ("<p>Hacking Puzzle Game</p>", "<p>Puzzle hacker</p>"),
        ("<p>Space Puzzle Game</p>", "<p>Puzzle spatial</p>"),
        ("<p>Classic Brick Breaker</p>", "<p>Casse-briques classique</p>"),
        ("<p>Space Adventure Game</p>", "<p>Aventure spatiale</p>"),
        ("<p>Endless Runner Game</p>", "<p>Course infinie</p>"),
        ("<p>Rhythm Platform Game</p>", "<p>Plateforme rythmique</p>"),
        ("<p>Math & Space Game</p>", "<p>Maths et espace</p>"),
        ("<p>Classic Sliding Tile Game</p>", "<p>Puzzle coulissant classique</p>"),
    ],
    "it": [
        ("<h2 id=\"currentGameTitle\">Select a Game</h2>", "<h2 id=\"currentGameTitle\">Scegli un gioco</h2>"),
        (
            "<p>Winning 2048 requires both strategy and practice. Here are the essential tips:</p>",
            "<p>Vincere a 2048 richiede strategia e pratica. Consigli essenziali:</p>",
        ),
        (
            "<li><strong>Master the corner strategy:</strong> Keep your highest value tile in one corner and build around it.</li>",
            "<li><strong>Strategia dell'angolo:</strong> Tieni la tessera più alta in un angolo e costruisci intorno.</li>",
        ),
        (
            "<li><strong>Build in one direction:</strong> Choose left, right, or down as your primary direction and stick to it.</li>",
            "<li><strong>Una direzione principale:</strong> Scegli sinistra, destra o giù e mantienila.</li>",
        ),
        (
            "<li><strong>Create cascading merges:</strong> Plan moves that will create multiple merges in sequence.</li>",
            "<li><strong>Fusioni a catena:</strong> Pianifica mosse che creano più fusioni di seguito.</li>",
        ),
        (
            "<li><strong>Control the board:</strong> Don't let tiles scatter randomly - maintain organized rows and columns.</li>",
            "<li><strong>Controlla la scacchiera:</strong> Non lasciare tessere sparse; mantieni righe e colonne ordinate.</li>",
        ),
        (
            "<li><strong>Practice regularly:</strong> The more you play, the better you'll understand tile movement patterns.</li>",
            "<li><strong>Pratica spesso:</strong> Più giochi, meglio capisci i movimenti delle tessere.</li>",
        ),
        (
            "<p>With these techniques, you'll improve your chances of achieving the coveted 2048 tile!</p>",
            "<p>Con queste tecniche aumenterai le possibilità di raggiungere la tessera 2048!</p>",
        ),
        (
            "<h3 class=\"faq-question\">What is the Origin of 2048 Game?</h3>",
            "<h3 class=\"faq-question\">Qual è l'origine del 2048?</h3>",
        ),
        (
            "<p>The 2048 game has an interesting history that traces back to earlier puzzle games:</p>",
            "<p>Il 2048 ha una storia legata a puzzle precedenti:</p>",
        ),
        (
            "<li><strong>Created by Gabriele Cirulli:</strong> The original 2048 was developed by Italian web developer Gabriele Cirulli in March 2014.</li>",
            "<li><strong>Creato da Gabriele Cirulli:</strong> Il 2048 originale è dell'italiano Gabriele Cirulli (marzo 2014).</li>",
        ),
        (
            "<li><strong>Inspired by Threes!:</strong> The game was inspired by the mobile game \"Threes!\" developed by Asher Vollmer.</li>",
            "<li><strong>Ispirato a Threes!:</strong> Il gioco si ispira al mobile «Threes!» di Asher Vollmer.</li>",
        ),
        (
            "<li><strong>Open source project:</strong> Cirulli made 2048 as an open-source project, allowing others to create variations.</li>",
            "<li><strong>Open source:</strong> Cirulli lo ha rilasciato open source per molte varianti.</li>",
        ),
        (
            "<li><strong>Viral success:</strong> The game became a viral sensation within days of its release, with millions of players worldwide.</li>",
            "<li><strong>Succeso virale:</strong> In pochi giorni milioni di giocatori nel mondo.</li>",
        ),
        (
            "<li><strong>Educational value:</strong> Many teachers use 2048 to teach mathematical concepts and logical thinking.</li>",
            "<li><strong>Valore educativo:</strong> Molti insegnanti lo usano per matematica e logica.</li>",
        ),
        (
            "<p>Today, 2048 has spawned countless variations and remains one of the most popular number puzzle games on the web!</p>",
            "<p>Oggi il 2048 ha innumerevoli varianti ed è tra i puzzle numerici più popolari sul web!</p>",
        ),
        ("<h4>Classic 2048</h4>", "<h4>2048 Classico</h4>"),
        ("<p>Original Game</p>", "<p>Gioco originale</p>"),
        ("<p>2048 Cars Game</p>", "<p>2048 auto</p>"),
        ("<p>Sweet & Delicious</p>", "<p>Dolce e delizioso</p>"),
        ("<p>Taylor Swift Game</p>", "<p>2048 Taylor Swift</p>"),
        ("<p>Disney Princess Theme</p>", "<p>Tema principesse Disney</p>"),
        ("<p>Merge Cats by Nobility</p>", "<p>Gatti per nobiltà</p>"),
        ("<p>Minecraft Block Theme</p>", "<p>Tema blocchi Minecraft</p>"),
        ("<p>Christmas Theme</p>", "<p>Tema natalizio</p>"),
        ("<p>Doge Game</p>", "<p>Gioco Doge</p>"),
        ("<p>Card Puzzle Game</p>", "<p>Puzzle di carte</p>"),
        ("<p>2048 Game Unblocked</p>", "<p>2048 sbloccato</p>"),
        ("<p>Relaxing Game</p>", "<p>Gioco rilassante</p>"),
        ("<p>Hexagonal Grid</p>", "<p>Griglia esagonale</p>"),
        ("<p>Flappy Bird Meets 2048</p>", "<p>Flappy Bird e 2048</p>"),
        ("<p>Mental Training Game</p>", "<p>Allenamento mentale</p>"),
        ("<p>Black & White Number Puzzle</p>", "<p>Puzzle numerico bianco e nero</p>"),
        ("<p>Hacking Puzzle Game</p>", "<p>Puzzle hacker</p>"),
        ("<p>Space Puzzle Game</p>", "<p>Puzzle spaziale</p>"),
        ("<p>Classic Brick Breaker</p>", "<p>Casse mattoni classico</p>"),
        ("<p>Space Adventure Game</p>", "<p>Avventura spaziale</p>"),
        ("<p>Endless Runner Game</p>", "<p>Runner infinito</p>"),
        ("<p>Rhythm Platform Game</p>", "<p>Piattaforme ritmiche</p>"),
        ("<p>Math & Space Game</p>", "<p>Matematica e spazio</p>"),
        ("<p>Classic Sliding Tile Game</p>", "<p>Puzzle scorrevole classico</p>"),
    ],
}


def apply_hub_guide(html: str, locale: str) -> str:
    for old, new in HUB_GUIDE_REPL[locale]:
        html = html.replace(old, new)
    return html
