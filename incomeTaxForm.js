$(document).ready(function () {
  // Real-time currency formatting for numeric fields
  function formatCurrency(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Validate Email format
  $("#email").on("input", function () {
    const email = $(this).val();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      $("#emailError").removeClass("hidden");
    } else {
      $("#emailError").addClass("hidden");
    }
  });

  // Validate NID format
  $("#nid").on("input", function () {
    const nid = $(this).val();
    if (!nid.match(/^[a-zA-Z]\d{11}[a-zA-Z]$/)) {
      $("#nidError").removeClass("hidden");
    } else {
      $("#nidError").addClass("hidden");
    }
  });

  // Add new income source
  $("#add-income-btn").click(function () {
    const newIncome = `
      <div class="income-source flex gap-2 mb-2 flex-wrap border-t-2 pt-3">
                  <input
                    type="text"
                    placeholder="Source of Income"
                    class="source-name w-2/5 px-4 py-2 border rounded min-w-max"
                  />
                  <input
                    type="date"
                    placeholder="Date"
                    class="income-date w-2/5 px-4 py-2 border rounded min-w-max"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    class="income-amount w-1/5 px-4 py-2 border rounded min-w-max"
                  />
        <button type="button" class="remove-income-btn px-4 py-2 text-white bg-red-500 rounded">Remove</button>
      </div>
    `;
    $("#income-source-wrapper").append(newIncome);
  });

  // Remove income source
  $(document).on("click", ".remove-income-btn", function () {
    $(this).closest(".income-source").remove();
  });

  // Form Validation and Calculation
  $("#incomeTaxForm").submit(function (e) {
    e.preventDefault();

    // Get values from inputs
    const annualSalary = parseFloat($("#annualSalary").val()) || 0;
    const additionalIncome =
      parseFloat(
        $(".income-amount")
          .toArray()
          .reduce((acc, el) => acc + parseFloat($(el).val() || 0), 0)
      ) || 0;
    console.log("additionalIncome :>> ", additionalIncome);
    const numDependents = parseInt($("#numDependents").val()) || 0;
    const charitableDonations =
      parseFloat($("#charitableDonations").val()) || 0;
    const mortgageInterest = parseFloat($("#mortgageInterest").val()) || 0;
    const pensionScheme = parseFloat($("#pensionScheme").val()) || 0;
    const investmentLossesOrGains =
      parseFloat($("#investmentLossesOrGains").val()) || 0;

    // Calculate total income
    const totalIncome = annualSalary + additionalIncome;
    console.log("totalIncome :>> ", totalIncome);

    // Define tax thresholds
    let threshold = 200000;
    if (numDependents === 1) threshold = 250000;
    if (numDependents === 2) threshold = 450000;
    if (numDependents > 2) threshold = 600000;

    // Tax rate
    const rate = totalIncome >= 500000 && totalIncome <= 1000000 ? 7.5 : 6;

    // Tax payable calculation
    const taxPayable =
      (totalIncome +
        investmentLossesOrGains -
        (charitableDonations + mortgageInterest + pensionScheme) -
        threshold) *
      (rate / 100);
    console.log("taxPayable :>> ", taxPayable);
    const formattedTaxPayable = formatCurrency(taxPayable.toFixed(2));

    // Display tax payable
    $("#taxPayable").val(formattedTaxPayable);
  });
});
