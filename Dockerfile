# Ruby 이미지를 기반으로 Jekyll 설치
FROM ruby:2.7

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 프로젝트 파일 복사
COPY Gemfile

# Bundler로 Gemfile 의존성 설치
RUN gem install bundler && bundle install

EXPOSE 4000
