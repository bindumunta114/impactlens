public class Report {

    public void showReport(int amount) {
        Billing billing = new Billing();

        billing.generateBill(amount);
    }
}