# 1. Python 기반 이미지 사용
FROM python:3.11-slim

# 2. 컨테이너 내부 작업 디렉토리 설정
WORKDIR /app

# 3. requirements.txt 먼저 복사
COPY requirements.txt .

# 4. 필요한 Python 패키지 설치
RUN pip install --no-cache-dir -r requirements.txt

# 5. 현재 프로젝트 파일 전체 복사
COPY . .

# 6. Flask 앱이 사용하는 포트 공개
EXPOSE 5000

# 7. 컨테이너 실행 시 Flask 앱 실행
CMD ["python", "main.py"]