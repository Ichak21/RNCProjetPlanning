
function ShowSoftCompetence(competence, assessment) {
  const user_competence= `${competence}`;
  const last_assessment= `${assessment}`;
  return (
    <div className="skill-container">
      <div className="operator-skill-container">{user_competence}</div>
      <div className="assessment-container">{last_assessment}</div>
    </div>
  );
}

export default ShowSoftCompetence;
