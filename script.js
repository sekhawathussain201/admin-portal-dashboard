// Modal functionality
const modals = document.querySelectorAll('.modal');
const addBtns = document.querySelectorAll('.add-btn');
const closeBtns = document.querySelectorAll('.close');

// Open modal
addBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    document.getElementById(target).style.display = 'flex';
  });
});

// Close modal
closeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal').style.display = 'none';
  });
});

// Close on outside click
window.addEventListener('click', e => {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
});

// Form submit (demo only)
document.getElementById('studentForm').addEventListener('submit', e => {
  e.preventDefault();
  alert('Student added!');
  e.target.reset();
  document.getElementById('studentModal').style.display = 'none';
});

document.getElementById('teacherForm').addEventListener('submit', e => {
  e.preventDefault();
  alert('Teacher added!');
  e.target.reset();
  document.getElementById('teacherModal').style.display = 'none';
});

document.getElementById('courseForm').addEventListener('submit', e => {
  e.preventDefault();
  alert('Course added!');
  e.target.reset();
  document.getElementById('courseModal').style.display = 'none';
});