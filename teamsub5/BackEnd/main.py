from flask import Flask, render_template, request

app = Flask(__name__)
saved_members = []
'''
index -> input -> result 순서로 진행하기 위해 기존 코드를 주석처리 하였습니다.
@app.route('/')
def input_page():
    # 사용자가 작성한 input.html 파일을 렌더링합니다.
    return render_template('input.html')
'''
@app.route('/') # 1. index
def main():
    return render_template('index.html')

@app.route('/input') # 2. input
def input_page():
    return render_template('input.html')

@app.route('/contact')
def contact():
    return render_template('contact.html', members=saved_members)

@app.route('/result', methods=['POST']) # 3. result
def result():
    # 1. 일반 필드 리스트 가져오기
    names = request.form.getlist('name[]')
    departments = request.form.getlist('Department[]')
    student_numbers = request.form.getlist('StudentNumber[]')
    phones = request.form.getlist('phone[]')
    mail_ids = request.form.getlist('mail_id[]')
    mail_domains = request.form.getlist('mail_domain[]')

    # 2. 팀원별 데이터를 딕셔너리 리스트로 재구성
    team_members = []
    for i in range(len(names)):
        # 기술 스택은 tech_stack[0][], tech_stack[1][] 형태로 들어오므로 인덱스로 접근
        techs = request.form.getlist(f'tech_stack[{i}][]')
        
        if 'etc' in techs:
            techs.remove('etc') # 'etc'라는 글자 자체는 제거
            etc_val = request.form.getlist('etc_stack[]')[i]
            if etc_val:
                # 쉼표로 구분해서 입력했을 경우를 대비해 분리하여 추가
                etc_list = [t.strip() for t in etc_val.split(',') if t.strip()]
                techs.extend(etc_list)
        
        member = {
            'name': names[i],
            'dept': departments[i],
            'sn': student_numbers[i],
            'phone': phones[i],
            'email': f"{mail_ids[i]}@{mail_domains[i]}",
            'techs': techs
        }
        team_members.append(member)

    # 3. 완성된 데이터를 result.html로 전달

    saved_members.extend(team_members)

    return render_template('result.html', members=team_members)

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)