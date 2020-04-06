var createModal = function(student) {
    d3.selectAll("div.modal .modal-body table tbody tr td").remove();
    
    d3.select("#pengImg")
      .attr("src", "imgs/" + student.picture);
    
    d3.select("#quizzes tbody tr").append("td")
      .selectAll("td")
        .data(student.quizes)
        .enter()
      .append("td").classed("inner-td", true)
        .text(function(quiz) { return quiz.grade; });
    
    d3.select("#homework tbody tr").append("td")
      .selectAll("td")
        .data(student.homework)
        .enter()
      .append("td").classed("inner-td", true)
        .text(function(hw) { return hw.grade; });
    
    d3.select("#tests tbody tr").append("td")
      .selectAll("td")
        .data(student.test)
        .enter()
      .append("td").classed("inner-td", true)
        .text(function(tet) { return tet.grade; });
    
    d3.select("#finalE tbody tr").append("td")
      .selectAll("td")
        .data(student.final)
        .enter()
      .append("td").classed("inner-td", true)
        .text(function(f) { return f.grade; });
    
    d3.select("#finalG tbody tr").append("td")
      .selectAll("td")
        .data([finalGrade(student)])
        .enter()
      .append("td").classed("inner-td", true)
        .text(function(finalG) { return finalG; });

    d3.select("div.modal").classed("trans-in", true).classed("hidden", false);
    d3.select(".main").transition()
        .duration(1000)
        .style("opacity", "0.5").style("background-color", "lightgrey");
    d3.select("div.modal").transition()
        .duration(1000)
        .style("top", "10px")
        .style("opacity", "100%")
        .on("end", function() {
            d3.select("div.modal").classed("trans-in", false).attr("style", null);
        });
    
    d3.select("#closeModal").on("click", clearModal);
}

var clearModal = function() {
    d3.select(".main").transition()
        .duration(1000)
        .style("opacity", null).style("background-color", null);
    d3.select("div.modal").style("opacity", "1").transition()
        .duration(1000)
        .style("opacity", "0")
        .style("top", "-100px")
        .on("end", function() {
            d3.select("div.modal").classed("hidden", true);
            d3.selectAll("div.modal .modal-body table tbody tr td").remove();
            d3.select("#pengImg").attr("src", "");
        });
}

// Calculate the mean grades
var meanGrade = function(array) {
    return d3.mean(array, function(assignment) { return assignment.grade; });
}

// Calculate the student's final grade
var finalGrade = function(student) {
    var finalPercent = student.final[0].grade * 0.35;
    var testPercent = meanGrade(student.test) * 0.3;
    var homeworkPercent = meanGrade(student.homework) * 0.15 * 2;
    var quizPercent = meanGrade(student.quizes) * 0.2 * 10;
    
    return Math.round(finalPercent + testPercent + homeworkPercent + quizPercent);
}

// Create the Table
var createTable = function(students) {
    var rows = d3.select("#penguinTable tbody")
      .selectAll("tr")
      .data(students)
      .enter()
      .append("tr")
      .classed("fail", function(student) {
          if(finalGrade(student) < 70) {
              return true;
          } else {
              return false;
          }
      })
      .on("click", function() {
          var student = d3.select(this).data();
          createModal(student[0]);
      });
    
    // Repetitive, but no way to shorten
    rows.append("td")
    .append("img")
    .attr("src", function(student) { return "imgs/" + student.picture; });
    
    rows.append("td")
    .text(function(student) { return Math.round(meanGrade(student.quizes)) + "/10" });
    
    rows.append("td")
    .text(function(student) { return Math.round(meanGrade(student.homework)) + "/50" });
    
    rows.append("td")
    .text(function(student) { return Math.round(meanGrade(student.test)) + "/100" });
    
    rows.append("td")
    .text(function(student) { return student.final[0].grade + "/100" });
    
    rows.append("td")
    .text(function(student) { return finalGrade(student) });
}

var clearTable = function() {
    d3.selectAll("#penguinTable tbody tr").remove();
}

var updateTable = function(students) {
    createTable(students);
    
    d3.select("#quiz").on("click", function() {
        // Sort the array of students
        students.sort(function(student1, student2) {
            if(meanGrade(student1.quizes) > meanGrade(student2.quizes)) { return 1; }
            else if(meanGrade(student1.quizes) < meanGrade(student2.quizes)) { return -1; }
            else { return 0; }
        });
        
        // Now, clear and redraw the table
        clearTable();
        createTable(students);
    });
    
    d3.select("#hw").on("click", function() {
        // Sort the array of students
        students.sort(function(student1, student2) {
            if(meanGrade(student1.homework) > meanGrade(student2.homework)) { return 1; }
            else if(meanGrade(student1.homework) < meanGrade(student2.homework)) { return -1; }
            else { return 0; }
        });
        
        // Now, clear and redraw the table
        clearTable();
        createTable(students);
    });
    
    d3.select("#test").on("click", function() {
        // Sort the array of students
        students.sort(function(student1, student2) {
            if(meanGrade(student1.test) > meanGrade(student2.test)) { return 1; }
            else if(meanGrade(student1.test) < meanGrade(student2.test)) { return -1; }
            else { return 0; }
        });
        
        // Now, clear and redraw the table
        clearTable();
        createTable(students);
    });
    
    d3.select("#finalExam").on("click", function() {
        // Sort the array of students
        students.sort(function(student1, student2) {
            if(student1.final[0].grade > student2.final[0].grade) { return 1; }
            else if(student1.final[0].grade < student2.final[0].grade) { return -1; }
            else { return 0; }
        });
        
        // Now, clear and redraw the table
        clearTable();
        createTable(students);
    });
    
    d3.select("#finalGrade").on("click", function() {
        // Sort the array of students
        students.sort(function(student1, student2) {
            if(finalGrade(student1) > finalGrade(student2)) { return 1; }
            else if(finalGrade(student1) < finalGrade(student2)) { return -1; }
            else { return 0; }
        });
        
        // Now, clear and redraw the table
        clearTable();
        createTable(students);
    });
}

// Get the penguin information
var penguinPromise = d3.json("classData.json");
penguinPromise.then(function(students) {
    updateTable(students);
}, function(err) {
    console.log("failed to get student data:", err);
});