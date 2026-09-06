<?php

namespace App\Providers;

use App\Repositories\Contracts\ApplicationRepositoryInterface;
use App\Repositories\Contracts\ChatMessageRepositoryInterface;
use App\Repositories\Contracts\CVRepositoryInterface;
use App\Repositories\Contracts\EmployerRepositoryInterface;
use App\Repositories\Contracts\GraduateRepositoryInterface;
use App\Repositories\Contracts\JobRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Eloquent\ApplicationRepository;
use App\Repositories\Eloquent\ChatMessageRepository;
use App\Repositories\Eloquent\CVRepository;
use App\Repositories\Eloquent\EmployerRepository;
use App\Repositories\Eloquent\GraduateRepository;
use App\Repositories\Eloquent\JobRepository;
use App\Repositories\Eloquent\UserRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(GraduateRepositoryInterface::class, GraduateRepository::class);
        $this->app->bind(EmployerRepositoryInterface::class, EmployerRepository::class);
        $this->app->bind(JobRepositoryInterface::class, JobRepository::class);
        $this->app->bind(ApplicationRepositoryInterface::class, ApplicationRepository::class);
        $this->app->bind(CVRepositoryInterface::class, CVRepository::class);
        $this->app->bind(ChatMessageRepositoryInterface::class, ChatMessageRepository::class);
    }
}
