# This will be configured for you when you run config_deploy
deploy_branch  = "gh-pages"

## -- Misc Configs -- ##

build_dir       = "build"     # compiled site directory
deploy_dir      = "_deploy"   # deploy directory (for Github pages deployment)


desc "deploy build directory to github pages"
task :deploy do
  puts "## Deploying branch to Github Pages "
  (Dir["#{deploy_dir}/*"]).each { |f| rm_rf(f) }
#  Rake::Task[:copydot].invoke(public_dir, deploy_dir)
  puts "\n## copying #{build_dir} to #{deploy_dir}"
  cp_r "#{build_dir}/.", deploy_dir
  cd "#{deploy_dir}" do
    system "git add ."
    system "git add -u"
    puts "\n## Commiting: Site updated at #{Time.now.utc}"
    message = "Site updated at #{Time.now.utc}"
    system "git commit -m \"#{message}\""
    puts "\n## Pushing generated #{deploy_dir} website"
    system "git push origin #{deploy_branch} --force"
    puts "\n## Github Pages deploy complete"
  end
end
