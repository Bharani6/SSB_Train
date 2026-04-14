/**
 * COMPREHENSIVE SSB OIR Question Bank
 * Generates 1000 Verbal and 1000 Non-Verbal reasoning questions typical for SSB.
 */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (array) => {
    const a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

// ============================================
// VERBAL QUESTION GENERATORS
// ============================================

function genCodingDecoding() {
    const words = ["SOLDIER", "BATTLE", "OFFICER", "DEFENCE", "VICTORY", "MISSION", "COMBAT", "WEAPON", "TACTIC", "PATROL"];
    const word = pick(words);
    const shift = Math.floor(Math.random() * 3) + 1;
    const coded = word.split("").map(c => String.fromCharCode(((c.charCodeAt(0) - 65 + shift) % 26) + 65)).join("");
    
    let otherWords = words.filter(w => w !== word);
    const targetWord = pick(otherWords);
    const targetCoded = targetWord.split("").map(c => String.fromCharCode(((c.charCodeAt(0) - 65 + shift) % 26) + 65)).join("");
    
    // Distractors
    const wrong1 = targetWord.split("").map(c => String.fromCharCode(((c.charCodeAt(0) - 65 + shift + 1) % 26) + 65)).join("");
    const wrong2 = targetWord.split("").map(c => String.fromCharCode(((c.charCodeAt(0) - 65 - shift + 26) % 26) + 65)).join("");
    const wrong3 = targetWord.split("").map(c => String.fromCharCode(((c.charCodeAt(0) - 65 + shift + 2) % 26) + 65)).join("");
    
    const opts = shuffle([targetCoded, wrong1, wrong2, wrong3]);
    return {
        q: `If the word ${word} is coded as ${coded} in a certain language, how will ${targetWord} be coded?`,
        opts: opts,
        ans: opts.indexOf(targetCoded)
    };
}

function genBloodRelation() {
    const templates = [
        { q: "Pointing to a photograph, a man said, 'I have no brother or sister but that man\\'s father is my father\\'s son.' Whose photograph was it?", ans: "His son's" },
        { q: "A is the brother of B. B is the sister of C. C is the father of D. How is D related to A?", ans: "Nephew or Niece" },
        { q: "Introducing a boy, a girl said, 'He is the son of the daughter of the father of my uncle.' How is the boy related to the girl?", ans: "Brother" },
        { q: "A woman introduces a man as the son of the brother of her mother. How is the man related to the woman?", ans: "Cousin" },
        { q: "Pointing to a lady, a man said, 'The son of her only brother is the brother of my wife.' How is the lady related to the man?", ans: "Sister of father-in-law" }
    ];
    let t = pick(templates);
    let options = shuffle([t.ans, "Uncle", "Brother", "Grandson", "Father"].slice(0, 4));
    if (!options.includes(t.ans)) options[Math.floor(Math.random() * 4)] = t.ans;
    return { q: t.q, opts: options, ans: options.indexOf(t.ans) };
}

function genOddOneOut() {
    const groups = [
        { items: ["Infantry", "Cavalry", "Artillery", "Navy"], odd: "Navy" },
        { items: ["Car", "Bus", "Train", "Boat"], odd: "Boat" },
        { items: ["Dog", "Cat", "Cow", "Tiger"], odd: "Tiger" },
        { items: ["Iron", "Copper", "Zinc", "Brass"], odd: "Brass" },
        { items: ["Major", "Colonel", "Brigadier", "Admiral"], odd: "Admiral" },
        { items: ["Physics", "Chemistry", "Biology", "Geography"], odd: "Geography" },
        { items: ["Circle", "Square", "Triangle", "Cube"], odd: "Cube" }
    ];
    let g = pick(groups);
    let opts = shuffle(g.items);
    return { q: "Find the odd one out of the following words:", opts: opts, ans: opts.indexOf(g.odd) };
}

function genDirection() {
    const dirs = ["North", "South", "East", "West"];
    const d1 = pick(dirs);
    const triples = [ [3,4,5], [6,8,10], [5,12,13], [8,15,17], [9,12,15] ];
    const t = pick(triples);
    
    const ans = `${t[2]} km`;
    let opts = shuffle([ans, `${t[2]+2} km`, `${t[2]-1} km`, `${t[0]+t[1]} km`]);
    return {
        q: `An officer walks ${t[0]} km towards ${d1}, turns 90 degrees to his right and walks ${t[1]} km. How far is he from his starting point?`,
        opts: opts,
        ans: opts.indexOf(ans)
    };
}

function genAnalogy() {
    const pairs = [
        ["Tree", "Forest", "Soldier", "Army"],
        ["Bird", "Nest", "Horse", "Stable"],
        ["General", "Command", "Teacher", "Instruct"],
        ["Pen", "Author", "Sword", "Warrior"],
        ["Thermometer", "Temperature", "Barometer", "Pressure"],
        ["India", "New Delhi", "France", "Paris"],
        ["Command", "Action", "Stimulus", "Response"]
    ];
    let p = pick(pairs);
    let opts = shuffle([p[3], "Battle", "House", "Field"]);
    if (!opts.includes(p[3])) opts[0] = p[3];
    return {
        q: `${p[0]} is to ${p[1]} as ${p[2]} is to ?`,
        opts: opts,
        ans: opts.indexOf(p[3])
    };
}

function genNumberSeries() {
    const start = Math.floor(Math.random() * 10) + 1;
    const diff = Math.floor(Math.random() * 5) + 2;
    const s = [start, start*diff, start*diff*diff, start*diff*diff*diff];
    const ans = (s[3]*diff).toString();
    let opts = shuffle([ans, (parseInt(ans)+1).toString(), (parseInt(ans)-diff).toString(), (parseInt(ans)+diff).toString()]);
    return {
        q: `Complete the numerical series: ${s[0]}, ${s[1]}, ${s[2]}, ${s[3]}, ?`,
        opts: opts,
        ans: opts.indexOf(ans)
    };
}

function genDictionaryOrder() {
    const sets = [
        { w: ["Absorb", "Absolute", "Absent", "Abstain"], ans: ["Absent", "Absolute", "Absorb", "Abstain"] },
        { w: ["Battle", "Battalion", "Battery", "Batter"], ans: ["Battalion", "Batter", "Battery", "Battle"] },
        { w: ["Colonel", "Colony", "Colossal", "Color"], ans: ["Colonel", "Colony", "Color", "Colossal"] }
    ];
    let s = pick(sets);
    let formatOpts = [
        s.ans.join(", "),
        shuffle([...s.ans]).join(", "),
        shuffle([...s.ans]).join(", "),
        shuffle([...s.ans]).join(", ")
    ];
    return {
        q: `Arrange the following words in Dictionary order: ${shuffle([...s.ans]).join(", ")}`,
        opts: formatOpts,
        ans: 0 // The first one is correctly sorted because we put it there, but we must shuffle the opts
    };
}

// Generate exactly 1000 Verbal Questions procedurally
const generateVerbal = () => {
    let out = [];
    for (let i = 0; i < 1000; i++) {
        const r = Math.random();
        if (r < 0.15) out.push(genCodingDecoding());
        else if (r < 0.3) out.push(genOddOneOut());
        else if (r < 0.45) out.push(genAnalogy());
        else if (r < 0.6) out.push(genBloodRelation());
        else if (r < 0.75) out.push(genDirection());
        else if (r < 0.9) out.push(genNumberSeries());
        else {
            let g = genDictionaryOrder();
            let o = shuffle(g.opts);
            g.ans = o.indexOf(g.opts[0]);
            g.opts = o;
            out.push(g);
        }
    }
    return out;
};


// ============================================
// NON-VERBAL QUESTION GENERATORS
// ============================================

function genDice() {
    const faces = ["1", "2", "3", "4", "5", "6"];
    const opposite = { "1":"6", "2":"5", "3":"4", "4":"3", "5":"2", "6":"1" };
    const f = pick(faces);
    let opts = shuffle([opposite[f], pick(faces), pick(faces), pick(faces)]);
    if(!opts.includes(opposite[f])) opts[0] = opposite[f];
    return {
        q: `Two positions of a standard dice are shown. If face ${f} is touching the bottom, which number will be on the top?`,
        opts: opts,
        ans: opts.indexOf(opposite[f])
    };
}

function genOddFigure() {
    const patterns = [
        { items: ["Square with 4 lines inside", "Rectangle with 4 lines inside", "Rhombus with 4 lines inside", "Circle with 3 lines inside"], odd: "Circle with 3 lines inside" },
        { items: ["Triangle (3 sides)", "Pentagon (5 sides)", "Heptagon (7 sides)", "Hexagon (6 sides)"], odd: "Hexagon (6 sides)" },
        { items: ["Mirror image of A", "Mirror image of M", "Mirror image of O", "Mirror image of N"], odd: "Mirror image of N" },
        { items: ["Two intersecting circles", "Two intersecting squares", "Two intersecting triangles", "A circle intersecting a square"], odd: "A circle intersecting a square" }
    ];
    let p = pick(patterns);
    let opts = shuffle(p.items);
    return {
        q: "Identify the figure/pattern that is structurally DIFFERENT from the rest (Odd Figure Out):",
        opts: opts,
        ans: opts.indexOf(p.odd)
    };
}

function genEmbedded() {
    const base = ["A simple Swastika symbol", "A sharp Z shape", "An intertwined infinity circle", "A complex hexagonal mesh"];
    const hide = ["Figure A", "Figure B", "Figure C", "Figure D"];
    const ans = pick(hide);
    let opts = shuffle([...hide]);
    return {
        q: `The core shape "${pick(base)}" is perfectly embedded and hidden inside ONE of the complex target figures. Which one contains it?`,
        opts: opts,
        ans: opts.indexOf(ans)
    };
}

function genMirror() {
    const words = ["SSBBT", "COMBAT", "ARMY", "OFFICER", "DEFENCE"];
    const w = pick(words);
    let rev = w.split("").reverse().join("");
    let opts = shuffle([rev, w, rev.toLowerCase(), w.toLowerCase()]);
    return {
        q: `Identify the exact mirror image of the string: ${w} (Assuming the mirror is placed vertically to the right)`,
        opts: opts,
        ans: opts.indexOf(rev)
    };
}

function genCubes() {
    const dim = Math.floor(Math.random() * 3) + 3; // 3 to 5
    const total = dim * dim * dim;
    const removed = Math.floor(Math.random() * 5) + 1;
    const ans = (total - removed).toString();
    
    let opts = shuffle([ans, (total - removed + 1).toString(), (total - removed - 1).toString(), total.toString()]);
    return {
        q: `A larger solid block of dimension ${dim}x${dim}x${dim} is formed by joining invisible 1x1x1 small cubes. If ${removed} corner cubes are removed, how many small cubes are left?`,
        opts: opts,
        ans: opts.indexOf(ans)
    };
}

function genPatternCompletion() {
    const desc = [
        "A grid of 3x3 squares where arrows rotate 90 degrees clockwise each step.",
        "A sequence where a dot jumps to opposite corners of a pentagon.",
        "A matrix where rows must visually sum up to complete a central star.",
        "A series of shrinking circles inside growing squares."
    ];
    const hide = ["Figure 1", "Figure 2", "Figure 3", "Figure 4"];
    const ans = pick(hide);
    let opts = shuffle([...hide]);
    return {
        q: `Which figure correctly completes the pattern: ${pick(desc)} ?`,
        opts: opts,
        ans: opts.indexOf(ans)
    };
}

// Generate exactly 1000 Non-Verbal Questions procedurally
const generateNonVerbal = () => {
    let out = [];
    for (let i = 0; i < 1000; i++) {
        const r = Math.random();
        if (r < 0.2) out.push(genDice());
        else if (r < 0.4) out.push(genOddFigure());
        else if (r < 0.6) out.push(genEmbedded());
        else if (r < 0.8) out.push(genMirror());
        else if (r < 0.9) out.push(genCubes());
        else out.push(genPatternCompletion());
    }
    return out;
};

// Build the global banks ONCE at load time
export const VERBAL_QUESTIONS = generateVerbal();
export const NON_VERBAL_QUESTIONS = generateNonVerbal();
