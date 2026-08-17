public class AverageMarks {

    public double averageMarks() {

        Marks marks = new Marks();

        int total = marks.totalMarks(80, 75, 90);

        int numberOfSubjects = 3;

        return (double) total / numberOfSubjects;
    }
}