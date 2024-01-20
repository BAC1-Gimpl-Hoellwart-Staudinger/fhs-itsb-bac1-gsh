#include <vector>
#include <limits>
#include <chrono>
#include <iostream>
#include <cmath>

constexpr long long MAX_ITER = 1000000000;
long long iter = 0;

class Schedule
{
public:
    Schedule(std::vector<int> sched) : sched(sched) {}
    std::vector<int> sched;
};

class ScheduleGenerator
{
public:
    // assumed empl ids are 1 ... num_empl(incl)
    static Schedule generate(int days, int num_empl)
    {
        std::vector<int> sched(days, 1), best(days, 0);
        int index = 0;
        int next_empl = 1;
        int best_fit = std::numeric_limits<int>::max();

        for (int i = 0; i < MAX_ITER && i < (int)std::pow(num_empl, days) - 1; i++)
        {
            iter++;
            // sched++;
            int j = 0;
            while (sched[j] == num_empl)
            {
                sched[j] = 1;
                j++;
            }
            sched[j]++;
            int new_fit = evaluate(sched);
            if (new_fit < best_fit)
                best = sched;
        }
        return Schedule(sched);
    }

private:
    static void print(const std::vector<int> &sched)
    {
        for (auto x : sched)
            std::cout << x << ",";
        std::cout << std::endl;
    }

    static double evaluate(const Schedule &sched)
    {
        return 2.0;
    }
};

int main()
{
    int days = 365;
    int num_empl = 10;
    const auto start{std::chrono::steady_clock::now()};
    Schedule s = ScheduleGenerator::generate(days, num_empl);
    const auto end{std::chrono::steady_clock::now()};
    auto diff = std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count();
    std::cout << "Time elapsed: " << diff << "ms" << std::endl;
    std::cout << "Schedules generated: " << iter << std::endl;
}