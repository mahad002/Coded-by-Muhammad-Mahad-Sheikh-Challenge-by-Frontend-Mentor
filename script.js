$(document).ready(function () {
      // Fetch data from JSON file
      $.getJSON('data.json')
      .done(function (data) {
          // Loop through the JSON data and create elements for each job
          $.each(data, function (index, job) {
              const container = $("<div>").addClass("job-object");

              // Check if the job is both new and featured
              const isNewAndFeatured = job.new && job.featured;

              // Add the border-left and transition styles conditionally
              if (isNewAndFeatured) {
                  container.css({
                      "border-left": "0.35em solid var(--desaturated-dark-cyan)",
                      "transition": "background 0.3s ease"
                  });
              }


              // Create elements for job details
              const leftDiv = $("<div>").addClass("job-object-side");

              const logoImg = $("<img>").attr("src", job.logo).attr("alt", `${job.company} Logo`).addClass("circular-avatar");

              const infoDiv = $("<div>").addClass("job-object-left-desc");

              const companyName = $("<h2>").addClass("company").text(job.company);

              const isNew = $("<span>").addClass("new").text("New!");
              if (!job.new) isNew.hide(); 

              const isFeatured = $("<span>").addClass("featured").text("Featured");
              if (!job.featured) isFeatured.hide();

              const jobTitle = $("<h3>").addClass("position").text(job.position);

              const jobDetailsDiv = $("<div>").addClass("DykGo");

              const detailsArray = [
                  { label: job.postedAt },
                  { label: job.contract },
                  { label: job.location },
              ];

              $.each(detailsArray, function (index, detail) {
                  const detailSpan = $("<span>").addClass("about").text(detail.label);
                  jobDetailsDiv.append(detailSpan);

                  if (index !== detailsArray.length - 1) {
                      const emptyDiv = $("<div>").addClass("dot");
                      jobDetailsDiv.append(emptyDiv);
                  }
              });

              // Add a click event listener to show the job description when the job object is clicked
              jobTitle.click(function () {
                  showJobDescription(job);
              });

              // Append elements to the container
              infoDiv.append(companyName);
              infoDiv.append(isNew);
              infoDiv.append(isFeatured);
              infoDiv.append(jobTitle);
              infoDiv.append(jobDetailsDiv);

              leftDiv.append(logoImg);
              leftDiv.append(infoDiv);

              container.append(leftDiv);

              // Create buttons for job tags (role, level, languages, tools)
              const rightDiv = $("<div>").addClass("job-object-side2");

              const roleButton = $("<button>").addClass("button-rll").text(job.role);
              rightDiv.append(roleButton);

              const levelButton = $("<button>").addClass("button-rll").text(job.level);
              rightDiv.append(levelButton);

              const tagsArray = job.languages.concat(job.tools);

              $.each(tagsArray, function (index, tag) {
                  const tagButton = $("<button>").addClass("button-rll").text(tag);

                  // Add an onClick function to move the button
                  tagButton.click(function () {
                      moveButtonToFollowingDiv(tagButton);
                  });

                  rightDiv.append(tagButton);
              });

              container.append(rightDiv);

              // Add a remove button to each job object
              const removeButton = $("<button>").addClass("remove-button").text("Remove");

              // Add a click event listener to remove the job object when the button is clicked
              removeButton.click(function () {
                container.remove(); // Remove the job object container
              });

              // Add a mouseover event listener to show the remove button on hover
              container.mouseover(function () {
                  removeButton.show(); // Show the remove button
              });

              // Add a mouseout event listener to hide the remove button when not hovered
              container.mouseout(function () {
                  removeButton.hide(); // Hide the remove button
              });

              container.append(removeButton); // Append the remove button to the job object

              // Append the job container to the dynamic content
              dynamicContent.append(container); 
          });
      })
      .fail(function (error) {
          console.error('Error fetching data:', error);
      });

      const dynamicContent = $("#dynamicContent");

      let filterIdCounter = 0; // Initialize a counter for unique filter IDs

      // Add a click event listener to buttons with class 'button-rll'
      $(document).on("click", ".button-rll", function () {
        const filterText = $(this).text();
        addFilter(filterText);
      });

      // Function to handle adding filters
      function addFilter(filterText) {
        const filterContainer = $(".filter-container");

        // Check if the filter already exists in the filter container
        const existingFilters = filterContainer.find(".sc-kfYoZR").map(function () {
            return $(this).text();
        }).get();

        if (!existingFilters.includes(filterText)) {
            // Generate a unique filter ID
            const filterId = `filter-${filterIdCounter++}`;

            // Create a filter element and add it to the filter container with the unique ID
            const filterElement = `
                <div class="filter-box" id="${filterId}">
                    <div class="filter-name">
                        <span class="sc-kfYoZR lpaEYv">${filterText}</span>
                        <button class="filter-remove" data-filter-id="${filterId}">
                            <img src="./images/icon-remove.svg" alt="remove filter">
                        </button>
                    </div>
                </div>
            `;
            filterContainer.append(filterElement);

            // Add an event listener to remove the filter when the remove button is clicked
            filterContainer.find(`button[data-filter-id="${filterId}"]`).click(function () {
                const filterIdToRemove = $(this).data("filter-id");
                $(`#${filterIdToRemove}`).remove();

                // After removing the filter, reapply the job listing filters
                filterJobListings();
            });

            // After adding the filter, reapply the job listing filters
            filterJobListings();
        }
      }

      // Add an event listener to buttons with class 'sc-fKgJPI filter-remove' (for removing filters)
      $(document).on("click", ".sc-fKgJPI.filter-remove", function () {
        const filterIdToRemove = $(this).data("filter-id");
        $(`#${filterIdToRemove}`).remove();

        // After removing the filter, reapply the job listing filters
        filterJobListings();
      });


      // Function to filter job listings based on selected filters
      function filterJobListings() {
        const selectedFilters = $(".filter-container .sc-kfYoZR").map(function () {
            return $(this).text();
        }).get();

        // Loop through each job listing and check if it matches the selected filters
        $(".job-object").each(function () {
            const job = $(this);

            // Get the job's tags (role, level, languages, tools)
            const jobTags = job.find(".button-rll").map(function () {
                return $(this).text();
            }).get();

            // Check if the job's tags match the selected filters
            const isJobVisible = selectedFilters.every(function (filter) {
                return jobTags.includes(filter);
            });

            // Show or hide the job listing based on the filter matching
            if (isJobVisible) {
                job.show();
            } else {
                job.hide();
            }
        });
      }


      // Function to show the job description popup
      function showJobDescription(job) {
          const jobPopup = $("<div>").addClass("job-popup");
          jobPopup.html(`
              <div class="job-popup-content">
                  <span class="close-popup">&times;</span>
                  <h2>Job Description</h2>
                  <p class="job-description">Company: ${job.company}</p>
                  <p class="job-description">Position: ${job.position}</p>
                  <p class="job-description">Role: ${job.role}</p>
                  <p class="job-description">Level: ${job.level}</p>
                  <p class="job-description">Posted At: ${job.postedAt}</p>
                  <p class="job-description">Contract: ${job.contract}</p>
                  <p class="job-description">Location: ${job.location}</p>
                  <p class="job-description">Languages: ${job.languages.join(", ")}</p>
                  <p class="job-description">Tools: ${job.tools.join(", ")}</p>
              </div>
          `);
          $("body").append(jobPopup);

          // Add a click event listener to close the popup when the close button is clicked
          const closePopupButton = jobPopup.find(".close-popup");
          closePopupButton.click(function () {
              jobPopup.remove();
          });
      }

      // Define a function to create a job object container based on jobData
      function createJobObjectContainer(job) {
              const container = $("<div>").addClass("job-object");

              // Check if the job is both new and featured
              const isNewAndFeatured = job.new && job.featured;

              // Add the border-left and transition styles conditionally
              if (isNewAndFeatured) {
                  container.css({
                      "border-left": "0.35em solid var(--desaturated-dark-cyan)",
                      "transition": "background 0.3s ease"
                  });
              }


              // Create elements for job details
              const leftDiv = $("<div>").addClass("job-object-side");
              
              const logoImg = $("<img>").attr("src", job.logo).attr("alt", `${job.logo} Logo`).addClass("circular-avatar");

              const infoDiv = $("<div>").addClass("job-object-left-desc");

              const companyName = $("<h2>").addClass("company").text(job.company);

              const isNew = $("<span>").addClass("new").text("New!");
              if (!job.new) isNew.hide();

              const isFeatured = $("<span>").addClass("featured").text("Featured");
              if (!job.featured) isFeatured.hide();

              const jobTitle = $("<h3>").addClass("position").text(job.position);

              const jobDetailsDiv = $("<div>").addClass("DykGo");

              const detailsArray = [
                  { label: job.postedAt },
                  { label: job.contract },
                  { label: job.location },
              ];

              $.each(detailsArray, function (index, detail) {
                  const detailSpan = $("<span>").addClass("about").text(detail.label);
                  jobDetailsDiv.append(detailSpan);

                  if (index !== detailsArray.length - 1) {
                      const emptyDiv = $("<div>").addClass("dot");
                      jobDetailsDiv.append(emptyDiv);
                  }
              });

              // Add a click event listener to show the job description when the job object is clicked
              jobTitle.click(function () {
                  showJobDescription(job);
              });

              // Append elements to the container
              infoDiv.append(companyName);
              infoDiv.append(isNew);
              infoDiv.append(isFeatured);
              infoDiv.append(jobTitle);
              infoDiv.append(jobDetailsDiv);

              leftDiv.append(logoImg);
              leftDiv.append(infoDiv);

              container.append(leftDiv);

              // Create buttons for job tags (role, level, languages, tools)
              const rightDiv = $("<div>").addClass("job-object-side2");

              const roleButton = $("<button>").addClass("button-rll").text(job.role);
              rightDiv.append(roleButton);

              const levelButton = $("<button>").addClass("button-rll").text(job.level);
              rightDiv.append(levelButton);

              const tagsArray = job.languages.concat(job.tools);

              $.each(tagsArray, function (index, tag) {
                  const tagButton = $("<button>").addClass("button-rll").text(tag);

                  // Add an onClick function to move the button
                  tagButton.click(function () {
                      moveButtonToFollowingDiv(tagButton);
                  });

                  rightDiv.append(tagButton);
              });

              container.append(rightDiv);

              // Add a remove button to each job object
              const removeButton = $("<button>").addClass("remove-button").text("Remove");

              // Add a click event listener to remove the job object when the button is clicked
              removeButton.click(function () {
                container.remove(); // Remove the job object container
              });

              // Add a mouseover event listener to show the remove button on hover
              container.mouseover(function () {
                  removeButton.show(); // Show the remove button
              });

              // Add a mouseout event listener to hide the remove button when not hovered
              container.mouseout(function () {
                  removeButton.hide(); // Hide the remove button
              });

              container.append(removeButton); // Append the remove button to the job object


        return container;
      }

      function openAddJobForm() {
        const formPopup = $("<div>").addClass("form-popup");
        formPopup.html(`
          <div class="form-popup-content">
            <span class="close-popup">&times;</span>
            <h2>Add Job</h2>
            <form id="jobForm">
              <label for="company">Company:</label>
              <input type="text" id="company" name="company" required><br>

              <label for="logo">Logo Path:</label>
              <input type="text" id="logo" name="logo"><br>

              <label for="new">New:</label>
              <input type="checkbox" id="new" name="new"><br>

              <label for="featured">Featured:</label>
              <input type="checkbox" id="featured" name="featured"><br>

              <label for="position">Position:</label>
              <select id="position" name="position">
                <option value="Fullstack Developer">Fullstack Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Front-end Dev">Front-end Dev</option>
                <option value="Junior Front-end Dev">Junior Front-end Dev</option>
                <option value="Senior Front-end Dev">Senior Front-end Dev</option>
                <option value="Senior Fullstack Developer">Senior Fullstack Developer</option>
                <option value="Junior Fullstack Developer">Junior Fullstack Developer</option>
                <option value="Junior Backend Developer">Junior Backend Developer</option>
                <option value="Senior Backend Developer">Senior Backend Developer</option>
                <option value="Junior Software Engineer">Junior Software Engineer</option>
                <option value="Senior Software Engineer">Senior Software Engineer</option>
              </select><br>

              <label for="role">Role:</label>
              <select id="role" name="role">
                <option value="Fullstack">Fullstack</option>
                <option value="Backend">Backend</option>
                <option value="Frontend">Frontend</option>
              </select><br>

              <label for="level">Level:</label>
              <select id="level" name="level">
                <option value="Midweight">Midweight</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
              </select><br>

              <label for="postedAt">Posted At:</label>
              <input type="text" id="postedAt" name="postedAt" required><br>

              <label for="contract">Contract:</label>
              <select id="contract" name="contract">
                <option value="Part Time">Part Time</option>
                <option value="Full Time">Full Time</option>
                <option value="Contract">Contract</option>
              </select><br>

              <label for="location">Location:</label>
              <select id="location" name="location">
                <option value="UK Only">UK Only</option>
                <option value="USA Only">USA Only</option>
                <option value="Worldwide">Worldwide</option>
                <option value="Remote">Remote</option>
              </select><br>

              <label for="languages">Languages:</label>
              <input type="text" id="newLanguage" name="languages">
              <button type="button" id="addLanguage">Add Language</button><br>
              <div id="languageList"></div>

              <label for="tools">Tools:</label>
              <input type="text" id="newTool" name="tools">
              <button type="button" id="addTool">Add Tool</button><br>
              <div id="toolList"></div>

              <input type="submit" value="Add Job">
            </form>
          </div>
        `);

        $(document).ready(function () {
          const languageList = $("#languageList");
          const toolList = $("#toolList");
          
          const selectedLanguages = []; // Array to store selected languages
          const selectedTools = []; // Array to store selected tools

          // Function to create item for languages or tools
          function createItem(itemText, list) {
              const item = $("<div>")
                  .addClass("item")
                  .text(itemText);

              const removeButton = $("<button>")
                  .addClass("remove-item")
                  .text("Remove");

              removeButton.click(function () {
                  item.remove();
                  // Remove the item from the respective array
                  if (list === languageList) {
                      const index = selectedLanguages.indexOf(itemText);
                      if (index !== -1) {
                          selectedLanguages.splice(index, 1);
                      }
                  } else if (list === toolList) {
                      const index = selectedTools.indexOf(itemText);
                      if (index !== -1) {
                          selectedTools.splice(index, 1);
                      }
                  }
              });

              item.append(removeButton);
              list.append(item);
          }

          $("#addLanguage").click(function () {
              const newLanguage = $("#newLanguage").val().trim();
              if (newLanguage !== "") {
                  createItem(newLanguage, languageList);
                  selectedLanguages.push(newLanguage); // Add the language to the selectedLanguages array
                  $("#newLanguage").val("");
              }
          });

          $("#addTool").click(function () {
              const newTool = $("#newTool").val().trim();
              if (newTool !== "") {
                  createItem(newTool, toolList);
                  selectedTools.push(newTool); // Add the tool to the selectedTools array
                  $("#newTool").val("");
              }
          });

           // Add a click event listener to close the form popup
          const closePopupButton = formPopup.find(".close-popup");
          closePopupButton.click(function () {
            formPopup.remove();
          });
        

          // Handle form submission
          const jobForm = $("#jobForm");
          jobForm.submit(function (event) {
              event.preventDefault(); // Prevent the default form submission behavior

              // Get the form input values, including selected languages and tools
              const jobData = {
                  company: $("#company").val(),
                  position: $("#position").val(),
                  logo:$('#logo').val(),
                  role: $("#role").val(),
                  level: $("#level").val(),
                  postedAt: $("#postedAt").val(),
                  contract: $("#contract").val(),
                  location: $("#location").val(),
                  languages: selectedLanguages,
                  tools: selectedTools,
                  new: $("#new").prop("checked"), // Checkbox state
                  featured: $("#featured").prop("checked"), // Checkbox state
              };

              // Create a job object container based on jobData
              const jobContainer = createJobObjectContainer(jobData);

              // Append the job container to the dynamic content
              dynamicContent.append(jobContainer);

              // Close the form popup
              formPopup.remove();
          });
        });

        $("body").append(formPopup);
      }
      
      // Add a click event listener to the "Add Job" button to open the form
      $("#add-job-button").click(function () {
        openAddJobForm();
      });
      
  
});
