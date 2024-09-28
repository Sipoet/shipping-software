# syntax=docker/dockerfile:1
FROM ruby:3.2.4-slim-bullseye
RUN apt-get update -qq && apt-get install -y nodejs postgresql-client build-essential apt-utils libpq-dev git curl
RUN git config --global core.symlinks false
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt-get install -y nodejs

ENV BUNDLE_PATH="/usr/local/bundle"
WORKDIR /shipping-software
COPY . /shipping-software

# add extra table needed on database
# RUN rails db:migrate

# set gems folder
RUN  bundle config set --local path '.gemset'

# Install application gems
RUN bundle install && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git
# Precompile bootsnap code for faster boot times
RUN bundle exec bootsnap precompile --gemfile
RUN npm install -g yarn

# Precompiling assets for production without requiring secret RAILS_MASTER_KEY
# RUN SECRET_KEY_BASE_DUMMY=1 ./bin/rails assets:precompile

# Add a script to be executed every time the container starts.
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

# Configure the main process to run when running the image
CMD ["rails", "server", "-b", "0.0.0.0", "-p", "3000"]
