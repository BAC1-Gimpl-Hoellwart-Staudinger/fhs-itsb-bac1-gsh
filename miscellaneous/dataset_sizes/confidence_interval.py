import requests
import numpy as np
import scipy.stats as stats

api_url = "http://localhost:8000/api/generate?startDate=2024-01-01&endDate=2026-01-01&numEmployees=10"
num_requests = 100
local_storage_sizes = []


def make_request():
    response = requests.get(api_url)
    return len(response.text)


for n in range(num_requests):
    response_length = make_request()
    # in localStorage a char is represented by 2 bytes (UTF-16)
    local_storage_size = response_length * 2
    local_storage_sizes.append(local_storage_size)
    print(f"Request {n+1} finished, localStorage size: {local_storage_size}")

# Arithmetisches Mittel von Stichprobe als Schätzer
p_hat = np.mean(local_storage_sizes)

alpha = 0.01
z = stats.norm.ppf(1 - alpha / 2)
# https://tidypython.com/when-to-use-ddof1-in-np-std/
# https://www.maths2mind.com/schluesselwoerter/bessel-korrektur
std_dev = np.std(local_storage_sizes, ddof=1)
l = z * std_dev / np.sqrt(num_requests)

# https://datagy.io/python-confidence-intervals/
# https://www.statology.org/confidence-intervals-python/
sanity_check = stats.norm.interval(confidence=0.99, loc=p_hat, scale=stats.sem(local_storage_sizes))

print(f"Durchschnittlich benötigter Speicherplatz: {p_hat}")
print(f"99%-Konfidenzintervall (lt. Formel): {p_hat-l:.2f} bis {p_hat+l:.2f}")
print(f"99%-Konfidenzintervall (lt. scipy.stats): {sanity_check[0]:.2f} bis {sanity_check[1]:.2f}")
