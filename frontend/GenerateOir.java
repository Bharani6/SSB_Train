import java.io.FileWriter;
import java.io.IOException;
import java.util.*;

public class GenerateOir {

    public static void main(String[] args) {
        List<Map<String, Object>> verbal = new ArrayList<>();
        List<Map<String, Object>> nonVerbal = new ArrayList<>();
        Random rand = new Random();

        // 1. Math Series (AP)
        for (int diff = 2; diff <= 20; diff++) {
            for (int start = 1; start <= 30; start++) {
                int[] seq = {start, start + diff, start + 2 * diff, start + 3 * diff, start + 4 * diff};
                int ans = start + 5 * diff;
                verbal.add(createQuestion(
                        String.format("Find the missing number in the series: %d, %d, %d, %d, %d, ?", seq[0], seq[1], seq[2], seq[3], seq[4]),
                        ans, rand, true
                ));
            }
        }

        // 2. Math Series (Geometric)
        for (int mult = 2; mult <= 5; mult++) {
            for (int start = 1; start <= 30; start++) {
                int[] seq = {start, start * mult, start * (int)Math.pow(mult, 2), start * (int)Math.pow(mult, 3), start * (int)Math.pow(mult, 4)};
                int ans = start * (int)Math.pow(mult, 5);
                verbal.add(createQuestion(
                        String.format("Find the missing number in the series: %d, %d, %d, %d, %d, ?", seq[0], seq[1], seq[2], seq[3], seq[4]),
                        ans, rand, true
                ));
            }
        }

        // 3. Squares
        for (int start = 1; start <= 60; start++) {
            verbal.add(createQuestion(
                    String.format("What is the next number: %d, %d, %d, %d, %d, ?", (start*start), ((start+1)*(start+1)), ((start+2)*(start+2)), ((start+3)*(start+3)), ((start+4)*(start+4))),
                    (start+5)*(start+5), rand, true
            ));
        }

        // 4. Alternating
        for (int inc = 2; inc <= 15; inc++) {
            for (int dec = 1; dec < inc; dec++) {
                for (int start = 10; start <= 20; start++) {
                    int ans = start + 3 * inc - 2 * dec;
                    verbal.add(createQuestion(
                            String.format("Identify the next term in the alternating pattern: %d, %d, %d, %d, %d, ?", start, start+inc, start+inc-dec, start+2*inc-dec, start+2*inc-2*dec),
                            ans, rand, true
                    ));
                }
            }
        }

        // 5. Alphabets
        String alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (int start = 0; start < 26; start++) {
            for (int step = 1; step <= 5; step++) {
                String ans = String.valueOf(alpha.charAt((start + 4 * step) % 26));
                List<String> opts = new ArrayList<>();
                opts.add(ans);
                while (opts.size() < 4) {
                    String rc = String.valueOf(alpha.charAt(rand.nextInt(26)));
                    if (!opts.contains(rc)) opts.add(rc);
                }
                Collections.shuffle(opts);
                Map<String, Object> qMap = new HashMap<>();
                qMap.put("q", String.format("Complete the letter series: %c, %c, %c, %c, ?", alpha.charAt(start), alpha.charAt((start + step)%26), alpha.charAt((start + 2*step)%26), alpha.charAt((start + 3*step)%26)));
                qMap.put("opts", opts);
                qMap.put("ans", opts.indexOf(ans));
                verbal.add(qMap);
            }
        }

        // Non-Verbal
        String[] shapes = {"Square", "Circle", "Triangle", "Pentagon", "Hexagon", "Octagon", "Star", "Rhombus"};
        String[] elements = {"dot", "cross", "line", "star", "dash", "arrow"};
        String[] colors = {"black", "white", "grey", "shaded"};

        for (String s : shapes) {
            for (String e : elements) {
                for (int start = 1; start <= 20; start++) {
                    String ans = s + " with " + (start + 3) + " " + e + "(s)";
                    List<String> opts = new ArrayList<>(Arrays.asList(ans, s + " with " + (start + 4) + " " + e + "(s)", s + " with " + (start - 1) + " " + e + "(s)", "Triangle with " + (start + 3) + " " + e + "(s)"));
                    Collections.shuffle(opts);
                    Map<String, Object> qMap = new HashMap<>();
                    qMap.put("q", String.format("Which figure completes the series: (1) %s with %d %s(s), (2) %s with %d %s(s), (3) %s with %d %s(s) ...?", s, start, e, s, start+1, e, s, start+2, e));
                    qMap.put("opts", opts);
                    qMap.put("ans", opts.indexOf(ans));
                    nonVerbal.add(qMap);
                }
            }
        }

        for (String s : shapes) {
            for (String c1 : colors) {
                for (String c2 : colors) {
                    if (c1.equals(c2)) continue;
                    String ans = s + " with " + c2 + " filling";
                    List<String> opts = new ArrayList<>(Arrays.asList(ans, s + " with " + c1 + " filling", "Different Shape with " + c2 + " filling", "Half " + c1 + " Half " + c2));
                    Collections.shuffle(opts);
                    Map<String, Object> qMap = new HashMap<>();
                    qMap.put("q", String.format("Analogy: A white square is to a black square as a %s %s is to a ...?", c1, s));
                    qMap.put("opts", opts);
                    qMap.put("ans", opts.indexOf(ans));
                    nonVerbal.add(qMap);
                }
            }
        }

        int[] angles = {45, 90, 135, 180, 225, 270, 315};
        for (int a : angles) {
            for (String s : shapes) {
                String ans = "Rotated " + a + " degrees";
                List<String> opts = new ArrayList<>(Arrays.asList(ans, "Rotated " + (a + 45) + " degrees", "Rotated " + (a - 45) + " degrees", "Mirror Image"));
                for (int i = 0; i < 3; i++) {
                    Collections.shuffle(opts);
                    Map<String, Object> qMap = new HashMap<>();
                    qMap.put("q", String.format("If a %s points North and is turned %d degrees clockwise, what is its new orientation?", s, a));
                    qMap.put("opts", opts);
                    qMap.put("ans", opts.indexOf(ans));
                    nonVerbal.add(qMap);
                }
            }
        }

        System.out.println("Generated: " + verbal.size() + " verbal, " + nonVerbal.size() + " non-verbal");

        Collections.shuffle(verbal);
        Collections.shuffle(nonVerbal);
        
        verbal = verbal.subList(0, 1000);
        nonVerbal = nonVerbal.subList(0, 1000);

        String path = "C:/Users/HP/.gemini/antigravity/scratch/ssb-training-system/frontend/src/utils/oirQuestionBank.js";
        try (FileWriter writer = new FileWriter(path)) {
            writer.write("/**\n");
            writer.write(" * COMPREHENSIVE SSB OIR Question Bank\n");
            writer.write(" * Contains 1000 Verbal and 1000 Non-Verbal reasoning questions typical for SSB interviews.\n");
            writer.write(" */\n\n");

            writer.write("export const VERBAL_QUESTIONS = [\n");
            for (int i = 0; i < verbal.size(); i++) {
                writer.write(formatMap(verbal.get(i)) + (i < verbal.size() - 1 ? ",\n" : "\n"));
            }
            writer.write("];\n\n");

            writer.write("export const NON_VERBAL_QUESTIONS = [\n");
            for (int i = 0; i < nonVerbal.size(); i++) {
                writer.write(formatMap(nonVerbal.get(i)) + (i < nonVerbal.size() - 1 ? ",\n" : "\n"));
            }
            writer.write("];\n");
            System.out.println("Successfully wrote 1000 verbal and 1000 non-verbal questions.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static String formatMap(Map<String, Object> map) {
        StringBuilder sb = new StringBuilder();
        sb.append("  { q: \"").append(((String)map.get("q")).replace("\"", "\\\"")).append("\", opts: [");
        List<String> opts = (List<String>) map.get("opts");
        for (int i = 0; i < opts.size(); i++) {
            sb.append("\"").append(opts.get(i).replace("\"", "\\\"")).append("\"");
            if (i < opts.size() - 1) sb.append(", ");
        }
        sb.append("], ans: ").append(map.get("ans")).append(" }");
        return sb.toString();
    }

    private static Map<String, Object> createQuestion(String q, int ans, Random rand, boolean isInt) {
        Set<Integer> optSet = new HashSet<>();
        optSet.add(ans);
        while (optSet.size() < 4) {
            int offset = rand.nextInt(10) + 1;
            if (rand.nextBoolean()) offset *= -1;
            int cand = ans + offset;
            if (cand != ans) optSet.add(cand);
        }
        List<String> optsList = new ArrayList<>();
        for (int val : optSet) optsList.add(String.valueOf(val));
        Collections.shuffle(optsList);

        Map<String, Object> map = new HashMap<>();
        map.put("q", q);
        map.put("opts", optsList);
        map.put("ans", optsList.indexOf(String.valueOf(ans)));
        return map;
    }
}
