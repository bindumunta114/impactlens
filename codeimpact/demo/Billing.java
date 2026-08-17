public class Billing {

    public void generateBill(int amount) {
        Calculator calculator = new Calculator();

        int total = calculator.calculate(amount, 100);

        System.out.println("Total Bill: " + total);
    }
}