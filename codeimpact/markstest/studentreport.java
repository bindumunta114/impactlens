public class StudentReport {

    public void generateReport() {

        AverageMarks average = new AverageMarks();

        double averageValue = average.averageMarks();

        System.out.println("Average Marks: " + averageValue);
    }
}