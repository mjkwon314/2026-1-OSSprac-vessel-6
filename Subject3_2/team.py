from flask import Flask, render_template, request, jsonify, Response
import csv
import io

app = Flask(__name__)

# [확인] 모든 기존 멤버 사전에 학번(sn)을 문자열로 확실하게 박아두었습니다.
TEAM_MEMBERS = [
    {
        "name": "김태형",
        "dept": "통계학과",
        "sn": "2021112345",
        "phone": "010-9995-1234",
        "email": "teahyung@gmail.com",
        "role": "Team Leader / result.html 담당, 입력 정보를 결과 페이지에 출력하고 전체 웹사이트를 검토함.",
        "techs": ["Python", "Flask", "R", "GitHub", "JAVA", "SAS", "Linux"],
        "leader": True,
    },
    {
        "name": "권민재",
        "dept": "정보통신공학과",
        "sn": "2020114567",
        "phone": "010-6292-1234",
        "email": "minjae1234@gmail.com",
        "role": "input.html 담당, 팀원 정보 입력 폼과 기술 스택 선택 기능을 구현함.",
        "techs": ["C++", "JAVA", "Linux"],
        "leader": False,
    },
    {
        "name": "김종헌",
        "dept": "정보통신공학과",
        "sn": "2019118901",
        "phone": "010-2657-9037",
        "email": "jongheon371@gmail.com",
        "role": "contact.html 담당, 팀원 연락처 페이지와 카드형 UI를 구현함.",
        "techs": ["C++", "Python"],
        "leader": False,
    },
    {
        "name": "이영민",
        "dept": "건축학과",
        "sn": "2022113456",
        "phone": "010-8838-0140",
        "email": "lymin0106@gmail.com",
        "role": "index.html 담당, 팀 소개와 프로젝트 개요를 담은 메인 페이지를 구현함.",
        "techs": ["Python", "JAVA"],
        "leader": False,
    },
]

SUBMITTED_MEMBERS = []
# 캘린더용 임시 이벤트 저장 리스트
currentEvents = []

@app.route("/")
def main():
    return render_template("index.html")

@app.route("/input")
def input_page():
    return render_template("input.html")

@app.route("/contact")
def contact():
    all_members = TEAM_MEMBERS + SUBMITTED_MEMBERS
    return render_template("contact.html", members=all_members)

# [API] 메인 화면에서 실시간 팀원 수를 가져가는 API
@app.route("/api/member-count", methods=["GET"])
@app.route("/api/member-count/", methods=["GET"])
def get_member_count():
    total_count = len(TEAM_MEMBERS) + len(SUBMITTED_MEMBERS)
    return jsonify({"count": total_count})

@app.route("/result", methods=["POST"])
def result():
    names = request.form.getlist("name[]")
    departments = request.form.getlist("Department[]")
    student_numbers = request.form.getlist("StudentNumber[]")
    phones = request.form.getlist("phone[]")
    mail_ids = request.form.getlist("mail_id[]")
    mail_domains = request.form.getlist("mail_domain[]")

    current_submitted = []

    for i in range(len(names)):
        techs = request.form.getlist(f"tech_stack[{i}][]")

        if "etc" in techs:
            techs.remove("etc")
            etc_val = request.form.get(f"etc_stack[{i}]")
            if etc_val:
                etc_list = [t.strip() for t in etc_val.split(",") if t.strip()]
                techs.extend(etc_list)

        member_data = {
            "name": names[i],
            "dept": departments[i],
            "sn": student_numbers[i],
            "phone": phones[i],
            "email": f"{mail_ids[i]}@{mail_domains[i]}",
            "techs": techs,
            "role": "추가된 팀원",
            "leader": False
        }
        
        current_submitted.append(member_data)
        SUBMITTED_MEMBERS.append(member_data)

    return render_template("result.html", members=current_submitted)

@app.route("/api/export-csv", methods=["GET"])
@app.route("/api/export-csv/", methods=["GET"])
def export_csv():
    all_members = TEAM_MEMBERS + SUBMITTED_MEMBERS
    
    output = io.StringIO()
    output.write('\ufeff') # 한글 깨짐 방지 BOM 추가
    
    writer = csv.writer(output)
    writer.writerow(["구분", "이름", "학과", "학번/사번", "전화번호", "이메일", "역할", "기술 스택"])
    
    for m in all_members:
        member_type = "기존 멤버(조장)" if m.get("leader") else ("기존 멤버" if m.get("role") != "추가된 팀원" else "추가 멤버")
        tech_str = ", ".join(m.get("techs", []))
        
        # [핵심] 딕셔너리에 sn 키가 없거나 비어있으면 '-' 처리, 있으면 해당 값 출력
        student_num = m.get("sn") if m.get("sn") else "-"
        
        writer.writerow([
            member_type,
            m.get("name"),
            m.get("dept"),
            student_num, 
            m.get("phone"),
            m.get("email"),
            m.get("role", ""),
            tech_str
        ])
    
    response = Response(output.getvalue(), mimetype="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=team_members.csv"
    return response

# 캘린더 일정 관련 API 엔드포인트
@app.route("/api/events", methods=["GET", "POST"])
def manage_events():
    global currentEvents
    if request.method == "POST":
        data = request.get_json()
        data["id"] = len(currentEvents) + 1
        currentEvents.append(data)
        return jsonify(data), 201
    return jsonify(currentEvents)

@app.route("/api/events/<int:event_id>", methods=["PUT", "DELETE"])
def modify_event(event_id):
    global currentEvents
    if request.method == "DELETE":
        currentEvents = [e for e in currentEvents if e["id"] != event_id]
        return jsonify({"result": "success"})
    elif request.method == "PUT":
        data = request.get_json()
        for e in currentEvents:
            if e["id"] == event_id:
                e.update(data)
                return jsonify(e)
        return jsonify({"error": "Not found"}), 404

if __name__ == "__main__":
    app.run(debug=True, port=5000,host="0.0.0.0")
