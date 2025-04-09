$(document).ready(function() {
  // Cấu hình số câu cho từng part
  const parts = {
      1: { start: 1, end: 6 },    // Part 1: 6 câu
      2: { start: 7, end: 31 },   // Part 2: 25 câu
      3: { start: 32, end: 70 },  // Part 3: 39 câu
      4: { start: 71, end: 100 },  // Part 4: 30 câu
      5: { start: 101, end: 130 },
      6: { start: 131, end: 146 },
      7: { start: 147, end: 200 },
  };

  let selectedParts = [];
  let currentQuestionIndex = 0; // Sử dụng index thay vì số câu trực tiếp
  let totalQuestions = 0;
  let answers = {};
  let questionOrder = []; // Mảng lưu thứ tự câu hỏi

  // Khi nhấn nút Start
  $("#start").click(function() {
      selectedParts = $("input[type='checkbox']:checked").map(function() {
          return parseInt($(this).val());
      }).get();

      if (selectedParts.length === 0) {
          alert("Please select at least one part!");
          return;
      }

      // Tạo danh sách câu hỏi theo thứ tự
      questionOrder = [];
      selectedParts.forEach(part => {
          for (let i = parts[part].start; i <= parts[part].end; i++) {
              questionOrder.push(i);
          }
      });
      totalQuestions = questionOrder.length;

      currentQuestionIndex = 0;
      showQuestion(questionOrder[currentQuestionIndex]);

      $("#part-selection").hide();
      $("#question-screen").show();
  });

  // Hiển thị câu hỏi
  function showQuestion(questionNum) {
      $("#question-number").text(questionNum);
      $(".answer-btn").removeClass("active");
      if (answers[questionNum]) {
          $(`.answer-btn[data-value='${answers[questionNum]}']`).addClass("active");
      }
  }

  // Chọn đáp án
  $(".answer-btn").click(function() {
      const value = $(this).data("value");
      const currentQuestion = questionOrder[currentQuestionIndex];
      answers[currentQuestion] = value;
      $(".answer-btn").removeClass("active");
      $(this).addClass("active");
  });

  // Nút Next
  $("#next").click(function() {
      if (currentQuestionIndex < totalQuestions - 1) {
          currentQuestionIndex++;
          showQuestion(questionOrder[currentQuestionIndex]);
      }
  });

  // Nút Back
  $("#back").click(function() {
      if (currentQuestionIndex > 0) {
          currentQuestionIndex--;
          showQuestion(questionOrder[currentQuestionIndex]);
      }
  });

  // Nút Finish
  $("#finish").click(function() {
      $("#question-screen").hide();
      $("#result-screen").show();

      let resultHtml = '<table class="table table-info"><tbody>';
      let count = 0;

      for (let question of questionOrder) {
          const answer = answers[question] || "?";

          // Bắt đầu một dòng mới nếu là câu đầu tiên của nhóm 10
          if (count % 10 === 0) {
              if (count > 0) {
                  resultHtml += '</tr>'; // Đóng dòng trước đó
              }
              resultHtml += '<tr>';
          }

          resultHtml += `<td>${question} - ${answer}</td>`;
          count++;

          // Đóng dòng nếu là câu cuối cùng
          if (question === questionOrder[questionOrder.length - 1]) {
              resultHtml += '</tr>';
          }
      }

      resultHtml += '</tbody></table>';
      $("#results").html(resultHtml || '<div>No answers selected.</div>');
  });

  // Nút Restart
  $("#restart").click(function() {
      answers = {};
      currentQuestionIndex = 0;
      totalQuestions = 0;
      questionOrder = [];
      $("#result-screen").hide();
      $("#part-selection").show();
      $("input[type='checkbox']").prop("checked", false);
  });
});